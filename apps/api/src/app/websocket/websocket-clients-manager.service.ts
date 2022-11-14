import {Injectable} from '@nestjs/common';
import {Server} from "socket.io";
import {WebsocketClient} from "./websocket-client";

@Injectable()
export class WebsocketClientsManagerService {
  private readonly urls = [
    "ws://192.168.2.249:81"
  ]
  private clients: WebsocketClient[] = [];

  /**
   * When the first client connects we make a connection to all configured websocket servers.
   */
  connectAll() {
    if (this.clients.length !== 0) return;

    for (const ip of this.urls) {
      const websocket = new WebsocketClient(ip);
      this.clients.push(websocket);
    }
  }

  /**
   * If there are no clients connected to the websocket server anymore, we disconnect all websocket clients.
   * @param server
   */
  disconnectAll(server: Server) {
    if (server.engine.clientsCount !== 0) return;

    for (const client of this.clients) {
      client.disconnect();
    }
    this.clients = []
  }

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
  setFFTValue(payload: string): void {
    this.sendAllClients(`. ${payload}`)
  }

  /**
   * Decrease the brightness of the ledstrips
   */
  decreaseBrightness(): void {
    this.sendAllClients('b')
  }

  /**
   * Increase the brightness of the ledstrips
   */
  increaseBrightness(): void {
    this.sendAllClients('B')
  }

  /**
   * Increase the speed of the ledstrips
   */
  increaseSpeed(): void {
    this.sendAllClients('S')
  }

  /**
   * Decrease the speed of the ledstrips
   */
  decreaseSpeed(): void {
    this.sendAllClients('s')
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
}
