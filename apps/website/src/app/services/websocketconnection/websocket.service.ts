import {Injectable} from '@angular/core'
import {map} from '../../shared/functions'
import {Connection} from '../../shared/interfaces/Connection'
import {environment} from '../../../environments/environment'
import iro from '@jaames/iro'
import {MessageService} from '../error/message.service'
import {io, Socket} from 'socket.io-client'
import {GradientInformation, ModeInformation} from '@angulon/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Connection {
  websocketUrl = environment.websockUrl
  private socket: Socket;
  private colorTimeout!: NodeJS.Timeout;

  constructor(errorService: MessageService) {
    super()
    this.socket = io(environment.websockUrl, {
      transports: ['websocket'],
    });
    this.socket.on('connect', () => {
      console.log(`Opened websocket at`, this.websocketUrl)
    });

    this.socket.on('disconnect', () => {
      console.log(`Disconnected from websocket at ${this.websocketUrl}`)
    });

    this.socket.on('connect_error', (error: Error) => {
      console.log(`Failed to connect to websocket at ${this.websocketUrl}`)
      console.error(error)
      errorService.setMessage(error)
    });
  }

  setColor(colors: iro.Color[] | string[]): void {
    // We need to slow this down because the cute little chip cant handle the SPEEED
    clearTimeout(this.colorTimeout)
    this.colorTimeout = setTimeout(() => {
      const color = colors[0]
      const colorstring: string = (color as iro.Color).hexString ? (color as iro.Color).hexString : color as string
      this.send('color', colorstring)
    }, 10)
  }

  setMode(modeNumber: number): void {
    this.send('mode', modeNumber.toString())
  }

  setLeds(value: number): void {
    const mappedValue = map(value, 0, 1, 0, 255)
    this.send('FFT', mappedValue.toString())
  }

  send(event: string, payload: string): void {
    if (this.isOpen()) {
      this.socket.emit(event, payload)
    }
  }

  isOpen(): boolean {
    return this.socket.connected
  }

  decreaseBrightness(): void {
    throw new Error('Method not implemented.')
  }

  increaseBrightness(): void {
    throw new Error('Method not implemented.')
  }

  decreaseSpeed(): void {
    throw new Error('Method not implemented.')
  }

  increaseSpeed(): void {
    throw new Error('Method not implemented.')
  }

  getModes(): Promise<ModeInformation[]> {
    return new Promise((resolve, reject) => {
      this.socket.emit('getModes', (data: ModeInformation[]) => {
        resolve(data)
      })
    });
  }

  getGradients(): Promise<GradientInformation[]> {
    return new Promise((resolve, reject) => {
      this.socket.emit('getGradients', (data: GradientInformation[]) => {
        resolve(data)
      })
    });
  }
}
