import {Injectable, Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {logger} from 'nx/src/utils/logger';
import {LedstripState} from "../../types/LedstripState";
import {constrain} from "@angulon/interfaces";

@Injectable()
export class WebsocketClientsManagerService {
  private server!: Server;
  private colorTimeout: NodeJS.Timeout;
  private state: LedstripState | undefined
  private logger: Logger = new Logger("WebsocketClientsManagerService");

  /**
   * Set the mode of all clients
   * @param mode
   */
  setMode(mode: number) {
    this.state.mode = mode;
    this.setStateOnAllLedstrips();
  }

  /**
   * Set the FFTValue on the ledstrips
   * @param {string}payload
   */
  setFFTValue(payload: number): void {
    this.state.fftValue = payload;
    this.setStateOnAllLedstrips()
  }

  /**
   * Receive a hex color to set on all ledstrips
   * Also broadcast the color to all users except the one that sent the message so their state can be updated
   * @param payload
   * @param originClient
   */
  setColor(payload: string[], originClient: Socket) {
    this.state.colors = payload;
    clearTimeout(this.colorTimeout);
    // The server sends messages so quickly, the ledstrips can't keep up so we have to slow it down
    this.colorTimeout = setTimeout(() => this.setStateOnAllLedstrips(), 10)
    this.sendAllUsers('color-change', payload, originClient);
  }

  decreaseSpeed() {
    this.state.speed = constrain(this.state.speed * 1.1, 200, 5000)
    this.setStateOnAllLedstrips()
  }

  increaseSpeed() {
    this.state.speed = constrain(this.state.speed * 0.9, 200, 5000)
    this.setStateOnAllLedstrips()
  }

  increaseBrightness() {
    this.state.brightness = constrain(this.state.brightness * 1.1, 10, 255)
    this.setStateOnAllLedstrips()
  }

  decreaseBrightness() {
    this.state.brightness = constrain(this.state.brightness * 0.9, 10, 255)
    this.setStateOnAllLedstrips()
  }

  /**
   * Update the server variable so we have access to all the connected clients
   * @param {Server} server
   */
  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Send a command to all ledstrips. These are all clients that are not in the user room
   * @private
   */
  private setStateOnAllLedstrips(): void {
    const clients = this.getLedstripClients();
    for (const client of clients) {
      client.emit("!", this.state);
    }
  }

  /**
   * Make the client join a room that is only for users - not ledstrips
   * @param {Socket} client
   */
  joinUserRoom(client: Socket) {
    client.join('user');
    this.logger.log(`Client ${client.conn.remoteAddress} joined the user room`);
  }

  /**
   * Send a message to all users except the one that sent the message
   * @param {string} event
   * @param {string[]} payload
   * @param {Socket} originClient
   * @private
   */
  private sendAllUsers(event: string, payload: string[], originClient: Socket) {
    const clients = this.server.sockets.sockets;
    for (const [, client] of clients) {
      if (client.id === originClient.id || !client.rooms.has('user')) continue;
      client.emit(event, payload);
    }
  }

  /**
   * This function is called when a ledstrip submits its state to the server
   * If one ledstrip is connected (this should be the ledstrip that submitted the state), the server will use the submitted state as its own state
   * If more ledstrips are connected, the server will send the current state to the ledstrip that submitted the state
   * @param client
   * @param payload
   */
  syncState(client: Socket, payload: LedstripState) {
    const ledstrips = this.getLedstripClients();

    if (ledstrips.length === 1 && ledstrips.includes(client)) {
      this.state = payload;
      this.logger.log(`Updating server state to state from ${client.conn.remoteAddress}`);
      return;
    }

    client.emit('!', this.state);
  }

  /**
   * Get a list of clients that are NOT in the user room, these are the ledstrips
   * @private
   */
  private getLedstripClients(): Socket[] {
    // Convert the clients from a Map to an array
    const clients = [...this.server.sockets.sockets.values()];
    return clients.filter(client => !client.rooms.has('user'));
  }
}
