import {Injectable, Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {INITIAL_LEDSTRIP_STATE, LedstripState, WebsocketMessage} from '@angulon/interfaces';
import {DeviceService} from '../device/device.service';

@Injectable()
export class WebsocketService {
  private server: Server | undefined;
  /**
   * This variable is the primary state, which will be sent to all ledstrips and users
   */
  private _state: LedstripState = INITIAL_LEDSTRIP_STATE;
  private logger: Logger = new Logger('WebsocketClientsManagerService');

  constructor(private readonly deviceService: DeviceService) {
  }

  /**
   * All the users are put in the user room. This function returns all connected clients that are a user client
   * @private
   */
  private get userClients(): Socket[] {
    const clients = this.server ? [...this.server.sockets.sockets.values()] : [];
    return clients.filter(client => client.rooms.has('user'));
  }

  /**
   * Get a list of clients that are NOT in the user room, these are the ledstrips
   * @private
   */
  private get ledstripClients(): Socket[] {
    const clients = this.server ? [...this.server.sockets.sockets.values()] : [];
    return clients.filter(client => !client.rooms.has('user'));
  }

  /**
   * Get the state of this server
   */
  getState(): LedstripState {
    return this._state;
  }

  /**
   * Set the received state on the server and send it to all ledstrips
   * @param newState
   * @param originClient
   */
  setState(newState: LedstripState, originClient: Socket) {
    this._state = newState;
    this.setStateOnAllLedstrips();
    this.setStateOnAllUsers(WebsocketMessage.StateChange, newState, originClient);
  }

  /**
   * Set the FFTValue on the ledstrips
   * @param {string}payload
   */
  setFFTValue(payload: number): void {
    if (!this._state) return;
    this._state.fftValue = payload;
    this.sendEventToAllLedstrips(WebsocketMessage.LedstripFFT, payload.toString());
  }

  /**
   * Send a command to all ledstrips. These are all clients that are not in the user room
   * @param force If true the ledstrips will update their state even if it's the same as the current state. Default is false
   */
  setStateOnAllLedstrips(force = false): void {
    this.logger.log(`Sending state to all ledstrips. Force: ${force}. State: ${JSON.stringify(this._state)}`);
    this.sendEventToAllLedstrips(WebsocketMessage.LedstripSetState, {...this._state, force: force});
  }

  /**
   * Make the client join a room that is only for users - not ledstrips. This way we can distinguish clients from being a user or a ledstrip
   * @param client
   */
  joinUserRoom(client: Socket) {
    client.join('user');
    this.logger.log(`Client ${client.conn.remoteAddress} joined the user room`);
  }

  /**
   * This function is called when a client connects to the server
   * @param client
   * @param server
   */
  onConnect(client: Socket, server: Server) {
    this.logger.log(`Client connected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.server = server;

    // If the client is a ledstrip, we are going to check if it is already registered in the database. If not, we will add it.
    if (this.isClientALedstrip(client)) {
      this.deviceService.addIfNotExists(client.conn.remoteAddress, {name: "Untitled Device", state: this._state}).then(wasAdded => {
        if (wasAdded) {
          this.logger.log(`Device ${client.conn.remoteAddress} was added to the database`);
        } else {
          this.logger.log(`Device ${client.conn.remoteAddress} was already registered in the database`);
        }
      });
    }
  }

  /**
   * This function is called when a client disconnects from the server
   * @param client
   * @param server
   */
  onDisconnect(client: Socket, server: Server) {
    this.logger.log(`Client disconnected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.server = server;
  }

  isClientAUser(client: Socket): boolean {
    return client.rooms.has('user');
  }

  isClientALedstrip(client: Socket): boolean {
    return !this.isClientAUser(client);
  }

  /**
   * Send a message to all users except the one that sent the message
   * @param {string} event
   * @param {string[]} payload
   * @param {Socket} originClient
   * @private
   */
  private setStateOnAllUsers(event: WebsocketMessage, payload: LedstripState, originClient: Socket) {
    const clients = this.userClients;
    for (const client of clients) {
      if (client.id !== originClient.id) {
        client.emit(event, payload);
      }
    }
  }

  /**
   * Send an event to all ledstrips with a given payload
   * @param event
   * @param payload
   * @private
   */
  private sendEventToAllLedstrips(event: WebsocketMessage, payload: unknown) {
    const clients = this.ledstripClients;
    for (const client of clients) {
      client.emit(event, payload);
    }
  }
}
