import {Injectable} from '@angular/core'
import {map} from '../../shared/functions'
import {environment} from '../../../environments/environment'
import iro from '@jaames/iro'
import {MessageService} from '../message-service/message.service'
import {io, Socket} from 'socket.io-client'
import {
  AddGradientResponse,
  GradientInformation,
  LedstripState,
  ModeInformation
} from '@angulon/interfaces';
import {Store} from '@ngrx/store';
import {colorChange} from '../../../redux/color/color.action';
import {ColorpickerState} from "../../../redux/color/color.reducer";
import {take} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class WebsocketService {
  private messageQueue: { event: string, payload?: string | string[] }[] = [];
  private websocketUrl = environment.url
  private socket: Socket;

  constructor(
    private messageService: MessageService,
    private readonly store: Store<{ colorpicker: ColorpickerState }>,
  ) {
    this.socket = io(this.websocketUrl, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log(`Opened websocket at`, this.websocketUrl)
      this.socket.emit('joinUserRoom')
      this.getState().then(data => {
        this.store.dispatch(colorChange(data.colors, false));
        this.messageQueue.forEach(message => {
          this.send(message.event, message.payload)
        });
        this.messageQueue = []
      })
    });

    this.socket.on('color-change', (colors: string[]) => {
      this.store.dispatch(colorChange(colors, false))
    })

    this.socket.on('disconnect', () => {
      console.log(`Disconnected from websocket at ${this.websocketUrl}`)
    });

    this.socket.on('connect_error', (error: Error) => {
      console.log(`Failed to connect to websocket at ${this.websocketUrl}`)
      console.error(error)
      messageService.setMessage(error)
    });
  }

  setColor(colors: iro.Color[] | string[]): void {
    const colorStrings = colors.map(color => typeof color === 'string' ? color : color.hexString)
    this.send('color', colorStrings)
  }

  setMode(modeNumber: number): void {
    this.send('mode', modeNumber.toString())
  }

  setLeds(value: number): void {
    const mappedValue = map(value, 0, 1, 0, 255)
    this.send('FFT', mappedValue.toString())
  }

  send(event: string, payload?: string | string[]): void {
    if (this.isOpen()) {
      this.socket.emit(event, payload)
    } else {
      console.log(`Websocket not open, adding ${event} to queue with payload ${payload}`);
      this.messageQueue.push({event: event, payload: payload});
    }
  }

  isOpen(): boolean {
    return this.socket.connected
  }

  decreaseBrightness(): void {
    this.send('decreaseBrightness')
  }

  increaseBrightness(): void {
    this.send('increaseBrightness')
  }

  decreaseSpeed(): void {
    this.send('decreaseSpeed')
  }

  increaseSpeed(): void {
    this.send('increaseSpeed')
  }

  getModes(): Promise<ModeInformation[]> {
    return this.promisifyEmit('getModes')
  }

  getGradients(): Promise<GradientInformation[]> {
    return this.promisifyEmit('gradients/get')
  }

  deleteGradient(id: number): Promise<GradientInformation[]> {
    return this.promisifyEmit("gradients/delete", {id})
  }

  addGradient(): Promise<AddGradientResponse> {
    return this.promisifyEmit("gradients/add")
  }

  editGradient(gradient: GradientInformation): Promise<GradientInformation[]> {
    return this.promisifyEmit("gradients/emit", gradient)
  }

  getState(): Promise<LedstripState> {
    return this.promisifyEmit<LedstripState>('getState')
  }

  private promisifyEmit<T>(eventName: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const error = new Error("Websocket response timeout exceeded")
        this.messageService.setMessage(error)
        reject(error)
      }, 3000)

      if (args.length == 1 && !Array.isArray(args[0])) {
        args = args[0]
      }
      this.socket.emit(eventName, args, (data: T) => {
        clearTimeout(timeout);
        resolve(data)
      })
    })
  }

  /**
   * This function turns off the ledstrips.
   * Sets the first color to black and the mode to 0 (Static).
   * This way we retain the other colors, but because mode 0 is static the other colors are not used in the effect and thus the ledstrip looks turned off.
   */
  turnOff(): void {
    this.setMode(0);
    this.store.pipe(take(1)).subscribe(state => {
      // The state array is readonly so we create a new array from the items in the state array, to prevent changing the original state directly
      const currentColors = [...state.colorpicker.colors];
      // Change the first color to black, retaining the other colors.
      // This is only possible because we also set the mode to 0 which only uses the first color.
      currentColors[0] = '#000000';
      // Then set the new colors through the official way, through the store
      this.store.dispatch(colorChange(currentColors, true))
    });
  }
}
