import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';

@Injectable()
export class WebsocketClientsManagerService {
  private server!: Server;
  private colorTimeout: NodeJS.Timeout;

  /**
   * Set the mode of all clients
   * @param mode
   */
  setMode(mode: number) {
    this.sendAllClients('/', mode.toString());
  }

  /**
   * Set the FFTValue on the ledstrips
   * @param {string}payload
   */
  setFFTValue(payload: number): void {
    this.sendAllClients('.', payload.toString())
  }

  /**
   * Receive a hex color to set on all ledstrips
   * @param payload
   */
  setColor(payload: string[]) {
    const formattedPayload = [];
    for (const rawColor of payload) {
      let formattedColor = rawColor;
      // If the payload contains a #, remove it
      if (rawColor.includes('#')) formattedColor = rawColor.replace('#', '');
      formattedPayload.push(formattedColor);
    }

    clearTimeout(this.colorTimeout);
    // The server sends messages so quickly, the ledstrips can't keep up so we have to slow it down
    this.colorTimeout = setTimeout(() => this.sendAllClients('#', formattedPayload), 10)
  }

  decreaseSpeed() {
    this.sendAllClients('?', undefined)
  }

  increaseSpeed() {
    this.sendAllClients('!', undefined)
  }

  increaseBrightness() {
    this.sendAllClients('+', undefined)
  }

  decreaseBrightness() {
    this.sendAllClients('-', undefined)
  }

  /**
   * Update the server variable so we have access to all the connected clients
   * @param {Server} server
   */
  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Send a command to all ledstrips
   * @param event
   * @param {string} payload
   * @private
   */
  private sendAllClients(event: string, payload: string | string[]): void {
    const clients = this.server.sockets.sockets;
    for (const [, client] of clients) {
      client.emit(event, payload)
    }
  }
}
