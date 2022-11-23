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
   * Set the brightness of all clients
   * @param brightness
   */
  setBrightness(brightness: number): void {
    this.sendAllClients('%', brightness.toString())
  }

  /**
   * Set the speed of the ledstrips
   * @param {number} speed
   */
  setSpeed(speed: number): void {
    this.sendAllClients('?', speed.toString())
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
   * Receive a hex color to set on all ledstrips
   * @param payload
   */
  setColor(payload: string) {
    // If the payload contains a #, remove it
    if (payload.includes('#')) payload = payload.replace('#', '');
    this.sendAllClients('#', payload)
  }

  /**
   * Update the server variable so we have access to all the connected clients
   * @param {Server} server
   */
  setServer(server: Server) {
    this.server = server;
  }
}
