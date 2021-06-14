import {Injectable} from '@angular/core'
import {map} from '../../shared/functions'
import {Connection} from '../../shared/interfaces/Connection'
import ReconnectingWebSocket from 'reconnecting-websocket'
import {environment} from '../../../environments/environment'
import iro from '@jaames/iro'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Connection {
  websocketUrl = environment.websockUrl;
  private socket: ReconnectingWebSocket;

  constructor() {
    super()

    this.socket = new ReconnectingWebSocket(this.websocketUrl)
    this.socket.onopen = (ev: Event) => {
      console.log(`Opened websocket at`, (ev.currentTarget as WebSocket).url)
    }
  }

  setColor(colors: iro.Color[] | string[]): void {
    const formattedColors = []
    for (const color of colors) {
      const colorstring: string = (color as iro.Color).hexString ? (color as iro.Color).hexString : color as string
      formattedColors.push(colorstring.substring(1, colorstring.length))
    }
    this.send(`c ${formattedColors[0]},${formattedColors[1]},${formattedColors[2]}`)
  }

  send(payload: string): void {
    if (this.isOpen()) {
      this.socket.send(payload)
    }
  }

  setMode(modeNumber: number): void {
    this.send(`m ${modeNumber}`)
  }

  isOpen(): boolean {
    return this.socket.readyState === this.socket.OPEN
  }

  decreaseBrightness(): void {
    this.send('b')
  }

  increaseBrightness(): void {
    this.send('B')
  }

  increaseSpeed(): void {
    this.send('S')
  }

  decreaseSpeed(): void {
    this.send('s')
  }

  setLeds(value: number): void {
    const mappedValue = map(value, 0, 1, 0, 255)
    this.send(`v ${mappedValue}`)
  }
}
