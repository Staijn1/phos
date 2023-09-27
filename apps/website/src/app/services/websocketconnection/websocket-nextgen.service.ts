import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MessageService } from '../message-service/message.service';
import { io, Socket } from 'socket.io-client';
import { GradientInformationExtended, LedstripState, ModeInformation, WebsocketMessage } from '@angulon/interfaces';
import { Store } from '@ngrx/store';
import { ChangeMultipleLedstripProperties, ReceiveLedstripState } from '../../../redux/ledstrip/ledstrip.action';

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceNextGen {
  private websocketUrl = environment.url;
  private readonly socket: Socket;
  private updateLedstripState = true;

  constructor(
    private messageService: MessageService,
    private readonly store: Store<{ ledstripState: LedstripState }>
  ) {
    this.socket = io(this.websocketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Opened websocket at', this.websocketUrl);

      this.promisifyEmit<LedstripState>(WebsocketMessage.RegisterAsUser).then((state) => this.updateAppState(state));
    });

    this.socket.on('disconnect', () => {
      console.log(`Disconnected from websocket at ${this.websocketUrl}`);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error(`Failed to connect to websocket at ${this.websocketUrl}`, error);
      messageService.setMessage(error);
    });

    this.socket.on(WebsocketMessage.StateChange, (state: LedstripState) => this.updateAppState(state));

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

        this.promisifyEmit<LedstripState>(WebsocketMessage.SetState, state).then();
      });
  }

  sendFFTValue(value: number) {
    this.socket.emit(WebsocketMessage.SetFFTValue, value);
  }

  /**
   * TODO: Reduxify this
   */
  getGradients(): Promise<GradientInformationExtended[]> {
    return this.promisifyEmit<GradientInformationExtended[]>(WebsocketMessage.GetGradients);
  }

  /**
   * TODO: Reduxify this
   */
  getModes() {
    return this.promisifyEmit<ModeInformation[]>(WebsocketMessage.GetModes);
  }

  turnOff() {
    this.store.dispatch(new ChangeMultipleLedstripProperties({ colors: ['#000000', '#000000'], mode: 0 }));
  }

  /**
   * Store the received state in the redux store, whilst setting the updateLedstripState flag.
   * This is required because otherwise this state change would trigger a new request to get the state from the server.
   * And this in turn, would trigger a new state change, and so on, infinitely.
   * @param state
   * @private
   */
  private updateAppState(state: LedstripState) {
    this.updateLedstripState = false;
    this.store.dispatch(new ReceiveLedstripState(state));
  }

  /**
   * Changes the .emit API of the websocket to a Promise-based API, so we can await the response
   * @param eventName - The name of the event to emit
   * @param args The arguments to pass to the event
   * @returns A promise that resolves when the server responds
   * @private
   */
  private promisifyEmit<T>(eventName: WebsocketMessage, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const error = new Error('Websocket response timeout exceeded');
        console.warn(`Timeout exceeded for event: ${eventName} with args: ${args.toString()}`, error);
        this.messageService.setMessage(error);
        reject(error);
      }, 3000);

      if (args.length == 1 && !Array.isArray(args[0])) {
        args = args[0];
      }
      this.socket.emit(eventName, args, (data: T) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });
  }
}
