import {Injectable, Logger} from "@nestjs/common";
import {Server, Socket} from "socket.io";
import {constrain, LedstripState} from "@angulon/interfaces";

@Injectable()
export class WebsocketClientsManagerService {
  private server: Server | undefined;
  private colorTimeout: NodeJS.Timeout;
  private state: LedstripState = {
    brightness: 255, colors: ["#000000", "#000000", "#000000"], fftValue: 0, mode: 0, speed: 1000
  };
  private logger: Logger = new Logger("WebsocketClientsManagerService");

  /**
   * Get state of this server
   */
  getState(): LedstripState {
    return this.state;
  }

  /**
   * Set the mode of all clients
   * @param mode
   */
  setMode(mode: number) {
    if (!this.state) return;
    this.state.mode = mode;
    this.setStateOnAllLedstrips();
  }

  /**
   * Set the FFTValue on the ledstrips
   * @param {string}payload
   */
  setFFTValue(payload: number): void {
    if (!this.state) return;
    this.state.fftValue = payload;
    this.sendEventToAllLedstrips(".", payload.toString());
  }

  /**
   * Receive a hex color to set on all ledstrips
   * Also broadcast the color to all users except the one that sent the message so their state can be updated
   * @param payload
   * @param originClient
   */
  setColor(payload: string[], originClient: Socket) {
    if (!this.state) return;
    this.state.colors = payload;
    clearTimeout(this.colorTimeout);
    // The server sends messages so quickly, the ledstrips can't keep up so we have to slow it down
    this.colorTimeout = setTimeout(() => this.setStateOnAllLedstrips(), 10);
    this.sendAllUsers("color-change", payload, originClient);
  }

  decreaseSpeed() {
    if (!this.state) return;
    this.state.speed = constrain(this.state.speed * 1.1, 200, 10000);
    this.setStateOnAllLedstrips();
  }

  increaseSpeed() {
    if (!this.state) return;
    this.state.speed = constrain(this.state.speed * 0.9, 200, 10000);
    this.setStateOnAllLedstrips();
  }

  increaseBrightness() {
    if (!this.state) return;
    this.state.brightness = constrain(this.state.brightness * 1.1, 10, 255);
    this.setStateOnAllLedstrips();
  }

  decreaseBrightness() {
    if (!this.state) return;
    this.state.brightness = constrain(this.state.brightness * 0.9, 10, 255);
    this.setStateOnAllLedstrips();
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
   * @param force If true the ledstrips will update their state even if it's the same as the current state. Default is false
   */
  setStateOnAllLedstrips(force = false): void {
    this.logger.log(`Sending state to all ledstrips. Force: ${force}. State: ${JSON.stringify(this.state)}`);
    this.sendEventToAllLedstrips("!", {...this.state, force: force});
  }

  /**
   * Make the client join a room that is only for users - not ledstrips
   * @param {Socket} client
   */
  joinUserRoom(client: Socket) {
    client.join("user");
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
    const clients = this.server ? this.server.sockets.sockets : new Map();
    for (const [, client] of clients) {
      if (client.id === originClient.id || !client.rooms.has("user")) continue;
      client.emit(event, payload);
    }
  }

  /**
   * This function is called when a ledstrip submits its state to the server
   * If it's the first time a ledstrip is connected since the server started, the server will take the state from the ledstrip
   * If it's not the first time, the server will send the state to the ledstrip
   * @param client
   * @param payload
   */
  syncState(client: Socket, payload: LedstripState) {
    // Copy the state from the first ledstrip that connects
    if (!this.state) {
      this.state = payload;
      this.logger.log(`Setting server state to copy state from ${client.conn.remoteAddress}`);
      return;
    }
    // To the ledstrip that just submitted it's state, send the state of the server because it's not the first ledstrip to connect
    client.emit("!", this.state);
  }

  /**
   * Get a list of clients that are NOT in the user room, these are the ledstrips
   * @private
   */
  private getLedstripClients(): Socket[] {
    // Convert the clients from a Map to an array
    const clients = this.server ? [...this.server.sockets.sockets.values()] : [];
    return clients.filter(client => !client.rooms.has("user"));
  }

  /**
   * Send an event to all ledstrips with a given payload
   * @param event
   * @param payload
   * @private
   */
  private sendEventToAllLedstrips(event: string, payload: unknown) {
    const clients = this.getLedstripClients();
    for (const client of clients) {
      client.emit(event, payload);
    }
  }
}
