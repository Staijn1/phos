import {Injectable} from '@angular/core'
import {map} from '../../shared/functions'
import {Connection} from '../../shared/interfaces/Connection'
import {environment} from '../../../environments/environment'
import iro from '@jaames/iro'
import {ErrorService} from '../error/error.service'
import {io, Socket} from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Connection {
  websocketUrl = environment.websockUrl
  private socket: Socket;
  private colorTimeout!: NodeJS.Timeout;

  constructor(errorService: ErrorService) {
    super()
    this.socket = io(environment.websockUrl);
    this.socket.on('connect', () => {
      console.log(`Opened websocket at`, this.websocketUrl)
    });

    this.socket.on('disconnect', () => {
      console.log(`Disconnected from websocket at ${this.websocketUrl}`)
    });

    this.socket.on('connect_error', (error) => {
      console.log(`Failed to connect to websocket at ${this.websocketUrl}`)
      errorService.setError(error)
    });
  }

  setColor(colors: iro.Color[] | string[]): void {
    // We need to slow this down because the cute little chip cant handle the SPEEED
    clearTimeout(this.colorTimeout)
    this.colorTimeout = setTimeout(() => {
      const color = colors[0]
      const colorstring: string = (color as iro.Color).hexString ? (color as iro.Color).hexString : color as string
      this.send("color", colorstring)
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

}
