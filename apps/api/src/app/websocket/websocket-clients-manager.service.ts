import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { LedstripState } from "@angulon/interfaces";

@Injectable()
export class WebsocketClientsManagerService {
  private server: Server | undefined;
  /**
   * This variable is the primary state, which will be sent to all ledstrips and users
   */
  private state: LedstripState = {
    brightness: 255,
    colors: ["#ff0000", "#000000", "#000000"],
    fftValue: 0,
    mode: 0,
    speed: 1000
  };
  private logger: Logger = new Logger("WebsocketClientsManagerService");

  /**
   * Get the state of this server
   */
  getState(): LedstripState {
    return this.state;
  }

  /**
   * Set the received state on the server and send it to all ledstrips
   * @param newState
   * @param originClient
   */
  setState(newState: LedstripState, originClient: Socket) {
    this.state = newState;
    this.setStateOnAllLedstrips();
    this.setStateOnAllUsers("state-change", newState, originClient);
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
   * Update the server variable so we have access to all the connected clients
   * @param server
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
    this.sendEventToAllLedstrips("!", { ...this.state, force: force });
  }

  /**
   * Send a message to all users except the one that sent the message
   * @param {string} event
   * @param {string[]} payload
   * @param {Socket} originClient
   * @private
   */
  private setStateOnAllUsers(event: string, payload: LedstripState, originClient: Socket) {
    const clients = this.server ? this.server.sockets.sockets : new Map();
    for (const [, client] of clients) {
      if (client.id === originClient.id || !client.rooms.has("user")) continue;
      client.emit(event, payload);
    }
  }

  /**
   * Make the client join a room that is only for users - not ledstrips
   * @param client
   */
  joinUserRoom(client: Socket) {
    client.join("user");
    this.logger.log(`Client ${client.conn.remoteAddress} joined the user room`);
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
