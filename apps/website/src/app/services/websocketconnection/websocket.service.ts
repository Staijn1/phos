import {Injectable} from '@angular/core'
import {map} from '../../shared/functions'
import {environment} from '../../../environments/environment'
import iro from '@jaames/iro'
import {MessageService} from '../message-service/message.service'
import {io, Socket} from 'socket.io-client'
import {AddGradientResponse, GradientInformation, ModeInformation} from '@angulon/interfaces';
import {Message} from '../../shared/types/Message';
import {Store} from '@ngrx/store';
import {colorChange} from '../../../redux/color/color.action';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private websocketUrl = environment.url
  private socket: Socket;

  constructor(
    messageService: MessageService,
    private readonly store: Store,
  ) {
    this.socket = io(this.websocketUrl, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log(`Opened websocket at`, this.websocketUrl)
      this.socket.emit('joinUserRoom')
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
    const colorStrings = []
    for (const rawColor of colors) {
      const color = typeof rawColor === 'string' ? rawColor : rawColor.hexString
      colorStrings.push(color)
    }
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
    return new Promise((resolve) => {
      this.socket.emit('getModes', (data: ModeInformation[]) => {
        resolve(data)
      })
    });
  }

  getGradients(): Promise<GradientInformation[]> {
    return new Promise((resolve) => {
      this.socket.emit('gradients/get', (data: GradientInformation[]) => {
        resolve(data)
      })
    });
  }

  deleteGradient(id: number): Promise<GradientInformation[]> {
    return new Promise((resolve) => {
      this.socket.emit('gradients/delete', {id}, (data: GradientInformation[]) => {
        resolve(data)
      })
    });
  }

  addGradient(): Promise<AddGradientResponse> {
    return new Promise((resolve) => {
      this.socket.emit('gradients/add', (data: AddGradientResponse) => {
        resolve(data)
      })
    })
  }

  editGradient(gradient: GradientInformation): Promise<GradientInformation[]> {
    return new Promise((resolve) => {
      this.socket.emit('gradients/edit', gradient, (data: GradientInformation[]) => {
        resolve(data)
      })
    })
  }
}
