import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';

@Injectable()
export class WebsocketClientsManagerService {
  private server!: Server;

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
  setColor(payload: string) {
    // If the payload contains a #, remove it
    if (payload.includes('#')) payload = payload.replace('#', '');
    this.sendAllClients('#', payload)
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
   * Send a command to all ledstrips
   * @param {string} payload
   * @private
   */
  private sendAllClients(event: string, payload: string): void {
    const clients = this.server.sockets.sockets;
    for (const [id, client] of clients) {
      client.emit(event, payload)
    }
  }


  /**
   * Update the server variable so we have access to all the connected clients
   * @param {Server} server
   */
  setServer(server: Server) {
    this.server = server;
  }


}
