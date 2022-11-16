import {Injectable} from '@nestjs/common';
import {Server, Socket} from "socket.io";
import {WebsocketClient} from "./websocket-client";

@Injectable()
export class WebsocketClientsManagerService {
  private clients: Socket[] = [];


  /**
   * Set the mode of all clients
   * @param mode
   */
  setMode(mode: number) {
    this.sendAllClients(`/${mode}`);
  }

  /**
   * Set the FFTValue on the ledstrips
   * @param {string}payload
   */
  setFFTValue(payload: number): void {
    this.sendAllClients(`.${payload}`)
  }

  /**
   * Set the brightness of all clients
   * @param brightness
   */
  setBrightness(brightness: number): void {
    this.sendAllClients(`%${brightness}`)
  }

  /**
   * Set the speed of the ledstrips
   * @param {number} speed
   */
  setSpeed(speed: number): void {
    this.sendAllClients(`?${speed}`)
  }

  /**
   * Send a command to all ledstrips
   * @param {string} payload
   * @private
   */
  private sendAllClients(payload: string): void {
    for (const client of this.clients) {
      client.send(payload)
    }
  }

  setColor(payload: string) {
    this.sendAllClients(payload)
  }

  /**
   * Remove a socket that has disconnected
   * @param client
   */
  removeClient(client: Socket) {
    this.clients = this.clients.filter(c => c.id !== client.id)
  }

  /**
   * Register a new socket that has connected
   * @param socket
   */
  addClient(socket: Socket) {
    this.clients.push(socket)
  }
}
