import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MessageService } from '../message-service/message.service';
import { io, Socket } from 'socket.io-client';
import {
  ClientSideLedstripState,
  GradientInformation,
  INetworkState,
  IRoom,
  LedstripState,
  ModeInformation,
  WebsocketMessage
} from '@angulon/interfaces';
import { Store } from '@ngrx/store';
import { ChangeMultipleLedstripProperties, ReceiveServerLedstripState } from '../../../redux/ledstrip/ledstrip.action';
import { LoadModesAction } from '../../../redux/modes/modes.action';
import { LoadGradientsAction } from '../../../redux/gradients/gradients.action';
import iro from '@jaames/iro';
import { LoadNetworkState } from '../../../redux/networkstate/networkstate.action';
import { UserPreferences } from '../../shared/types/types';
import { first } from 'rxjs';
import { ClientNetworkState } from '../../../redux/networkstate/ClientNetworkState';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private readonly websocketUrl = environment.url;
  private socket!: Socket;
  private updateLedstripState = true;
  private selectedRooms: IRoom[] = [];

  constructor(
    private messageService: MessageService,
    private readonly store: Store<{
      userPreferences: UserPreferences,
      modes: ModeInformation[],
      ledstripState: ClientSideLedstripState,
      networkState: ClientNetworkState
    }>
  ) {
    this.store.select('userPreferences')
      .pipe(first())
      .subscribe((userPreferences) => {
      this.socket = io(this.websocketUrl, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
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
      });

      this.socket.on('disconnect', () => {
        console.log(`Disconnected from websocket at ${this.websocketUrl}`);
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error(`Failed to connect to websocket at ${this.websocketUrl}`, error);
        messageService.setMessage(error);
      });

      this.socket.on(WebsocketMessage.StateChange, (state: LedstripState) => this.updateAppState(state));
      this.socket.on(WebsocketMessage.DatabaseChange, () => this.loadNetworkState().then());
    });

    this.store.select('networkState').subscribe(networkState => {
      if (!networkState) return;
      this.selectedRooms = networkState.selectedRooms;
    });

    // When the ledstrip state changes, and it was not this class that triggered the change, send the new state to the server
    this.store
      .select('ledstripState')
      .subscribe((state) => {
        if (!this.updateLedstripState) {
          this.updateLedstripState = true;
          return;
        }

        if (!this.socket || this.socket.disconnected) {
          return;
        }
        // Before sending the state to the server, we need to convert the iro.Colors to hex strings
        const payload: LedstripState = {...state, colors: state.colors.map(color => color.hexString)};
        this.promisifyEmit<LedstripState, LedstripState>(WebsocketMessage.SetNetworkState, payload).then();
      });
  }

  sendFFTValue(value: number) {
    this.socket.emit(WebsocketMessage.SetFFTValue, value);
  }

  turnOff() {
    this.store.dispatch(new ChangeMultipleLedstripProperties({
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
   * Store the received state in the redux store, whilst setting the updateLedstripState flag.
   * This is required because otherwise this state change would trigger a new request to get the state from the server.
   * And this, in turn, would trigger a new state change, and so on, infinitely.
   * @param state
   * @private
   */
  private updateAppState(state: LedstripState) {
    this.updateLedstripState = false;
    this.store.dispatch(new ReceiveServerLedstripState(state));
  }

  /**
   * Changes the .emit API of the websocket to a Promise-based API, so we can await the response
   * @param eventName - The name of the event to emit
   * @param payload
   * @returns A promise that resolves when the server responds
   * @private
   */
  private promisifyEmit<T, K>(eventName: WebsocketMessage, payload?: K): Promise<T> {
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
      }, (data: T) => {
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
    await this.promisifyEmit<void, Partial<IRoom>>(WebsocketMessage.CreateRoom, {name: roomName});
    await this.loadNetworkState();
  }

  async removeRoom(name: string) {
    await this.promisifyEmit<void, string>(WebsocketMessage.RemoveRoom, name);
    await this.loadNetworkState();
  }

  renameDevice(deviceName: string) {
    this.socket.emit(WebsocketMessage.RenameDevice, deviceName);
  }

  async assignDeviceToRoom(deviceName: string, roomName: string) {
    const payload = { deviceName: deviceName, roomName: roomName };
    this.socket.emit(WebsocketMessage.AssignDeviceToRoom, payload);
  }

  unassignDeviceFromRoom(deviceId: any, roomId: any) {
    // todo
    console.warn('unassignDeviceFromRoom is not implemented yet');
    return Promise.resolve();
  }
}
