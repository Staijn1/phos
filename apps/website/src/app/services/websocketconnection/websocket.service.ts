import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MessageService } from '../message-service/message.service';
import { io, Socket } from 'socket.io-client';
import {
  ClientSideRoomState,
  GradientInformation,
  IDevice,
  INetworkState,
  IRoom,
  ModeInformation,
  RoomState,
  WebsocketMessage
} from '@angulon/interfaces';
import { Store } from '@ngrx/store';
import { ChangeMultipleRoomProperties, ReceiveServerRoomState } from '../../../redux/roomstate/roomstate.action';
import { LoadModesAction } from '../../../redux/modes/modes.action';
import { LoadGradientsAction } from '../../../redux/gradients/gradients.action';
import iro from '@jaames/iro';
import { LoadNetworkState, NetworkConnectionStatusChange } from '../../../redux/networkstate/networkstate.action';
import { UserPreferences } from '../../shared/types/types';
import { first, Subscription } from 'rxjs';
import { ClientNetworkState, WebsocketConnectionStatus } from '../../../redux/networkstate/ClientNetworkState';
import { Message } from '../../shared/types/Message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private readonly websocketUrl = environment.url;
  private socket!: Socket;
  private updateRoomState = true;
  private selectedRooms: IRoom[] = [];
  private startupSubscribe: Subscription;
  private roomStateSubscription: Subscription;
  private networkStateSubscription: Subscription;


  constructor(
    private messageService: MessageService,
    private readonly store: Store<{
      userPreferences: UserPreferences,
      modes: ModeInformation[],
      roomState: ClientSideRoomState,
      networkState: ClientNetworkState
    }>
  ) {
    this.startupSubscribe = this.store.select('userPreferences')
      .pipe(first())
      .subscribe((userPreferences) => {
        this.socket = io(this.websocketUrl, {
          transports: ['websocket'],
          query: {
            deviceName: userPreferences.settings.deviceName
          }
        });
        this.socket.on('connect', () => {
          console.log('Opened websocket at', this.websocketUrl);

          this.promisifyEmit<void, null>(WebsocketMessage.RegisterAsUser).then();
          this.loadModes();
          this.loadGradients();
          this.loadNetworkState().then();
          this.store.dispatch(new NetworkConnectionStatusChange(WebsocketConnectionStatus.CONNECTED));
        });

        this.socket.on('disconnect', () => {
          console.log(`Disconnected from websocket at ${this.websocketUrl}`);
          this.store.dispatch(new NetworkConnectionStatusChange(WebsocketConnectionStatus.DISCONNECTED));
        });

        this.socket.on('connect_error', (error: Error) => {
          console.error(`Failed to connect to websocket at ${this.websocketUrl}`, error);
          messageService.setMessage(error);
          this.store.dispatch(new NetworkConnectionStatusChange(WebsocketConnectionStatus.CONNECTERROR));
        });

        this.socket.on(WebsocketMessage.StateChange, (state: RoomState) => this.updateAppState(state));
        this.socket.on(WebsocketMessage.DatabaseChange, () => this.loadNetworkState().then());
      });

    this.networkStateSubscription = this.store.select('networkState').subscribe(networkState => {
      if (!networkState) return;
      this.selectedRooms = networkState.selectedRooms;
    });

    // When the ledstrip state changes, and it was not this class that triggered the change, send the new state to the server
    this.roomStateSubscription = this.store
      .select('roomState')
      .subscribe((state) => {
        if (!this.updateRoomState) {
          this.updateRoomState = true;
          return;
        }

        // If we are not connected, do not send the state
        if (!this.socket || this.socket.disconnected) {
          return;
        }

        // Before sending the state to the server, we need to convert the iro.Colors to hex strings
        const payload: RoomState = { ...state, colors: state.colors.map(color => color.hexString) };
        this.promisifyEmit<INetworkState, RoomState>(WebsocketMessage.SetNetworkState, payload).then();
      });
  }

  ngOnDestroy() {
    this.networkStateSubscription.unsubscribe();
    this.roomStateSubscription.unsubscribe();
    this.startupSubscribe.unsubscribe();
  }

  sendFFTValue(value: number) {
    this.promisifyEmit<void, number>(WebsocketMessage.SetFFTValue, value).then();
  }

  turnOff() {
    this.store.dispatch(new ChangeMultipleRoomProperties({
      colors: [new iro.Color('#000000'), new iro.Color('#000000')],
      mode: 0
    }));
  }

  private loadGradients(): void {
    this.promisifyEmit<GradientInformation[], null>(WebsocketMessage.GetGradients)
      .then(gradients => this.store.dispatch(new LoadGradientsAction(gradients)));
  }

  private loadModes() {
    this.promisifyEmit<ModeInformation[], null>(WebsocketMessage.GetModes)
      .then((modes) => this.store.dispatch(new LoadModesAction(modes)));
  }

  /**
   * Store the received state in the redux store, whilst setting the updateRoomState flag.
   * This is required because otherwise this state change would trigger a new request to get the state from the server.
   * And this, in turn, would trigger a new state change, and so on, infinitely.
   * @param state
   * @private
   */
  private updateAppState(state: RoomState) {
    this.updateRoomState = false;
    this.store.dispatch(new ReceiveServerRoomState(state));
  }

  /**
   * Changes the .emit API of the websocket to a Promise-based API, so we can await the response
   * @param eventName - The name of the event to emit
   * @param payload
   * @returns A promise that resolves when the server responds
   * @private
   */
  private promisifyEmit<ReturnValue, RequestPayload>(eventName: WebsocketMessage, payload?: RequestPayload): Promise<ReturnValue> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const error = new Error('Websocket response timeout exceeded');
        console.warn(`Timeout exceeded for event: ${eventName} with args:`, payload, error);
        this.messageService.setMessage(error);
        reject(error);
      }, 3000);

      // Emits the event, waits for a response and resolves the promise when the server responds
      // Clears the timeout when the server responds because we received a response
      // Wraps the payload in additional metadata to send the command to the selected rooms
      this.socket.emit(eventName, {
        rooms: this.selectedRooms.map(room => room.id),
        payload: payload
      }, (data: ReturnValue) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });
  }

  private async loadNetworkState() {
    const networkState = await this.promisifyEmit<INetworkState, null>(WebsocketMessage.GetNetworkState);
    this.store.dispatch(new LoadNetworkState(networkState));
  }

  public async createRoom(roomName: string) {
    await this.promisifyEmit<void, Partial<IRoom>>(WebsocketMessage.CreateRoom, { name: roomName });
    await this.loadNetworkState();
  }

  async removeRoom(name: string) {
    await this.promisifyEmit<void, string>(WebsocketMessage.RemoveRoom, name);
    await this.loadNetworkState();
  }

  async renameDevice(deviceName: string) {
    await this.promisifyEmit(WebsocketMessage.RenameDevice, deviceName);
  }

  async assignDeviceToRoom(deviceName: string, roomName: string) {
    const payload = { deviceName: deviceName, roomName: roomName };
    await this.promisifyEmit(WebsocketMessage.AssignDeviceToRoom, payload);
  }

  unassignDeviceFromRoom(deviceId: any, roomId: any) {
    // todo
    console.warn('unassignDeviceFromRoom is not implemented yet');
    return Promise.resolve();
  }

  async getPowerDrawEstimateData() {
    return await this.promisifyEmit<Record<string, number>, null>(WebsocketMessage.GetPowerDrawEstimate);
  }

  deleteDevice(device: IDevice) {
    if (device.isConnected) {
      this.messageService.setMessage(new Message('warning', `Cannot delete device: "${device.name}", because it is currently connected`));
      return;
    }

    this.promisifyEmit(WebsocketMessage.DeleteDevice, device.id).then();
  }
}
