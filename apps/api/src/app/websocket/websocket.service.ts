import {Injectable, Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {INetworkState, INITIAL_LEDSTRIP_STATE, LedstripState, WebsocketMessage} from '@angulon/interfaces';
import {DeviceService} from '../device/device.service';
import {RoomService} from '../room/room.service';

@Injectable()
export class WebsocketService {
  private server: Server | undefined;
  /**
   * This variable is the primary state, which will be sent to all ledstrips and users
   */
  private _state: LedstripState = INITIAL_LEDSTRIP_STATE;
  private logger: Logger = new Logger('WebsocketClientsManagerService');

  constructor(private readonly deviceService: DeviceService, private readonly roomService: RoomService) {
  }

  /**
   * All the users are put in the user room. This function returns all connected clients that are a user client
   * @private
   */
  private get userClients(): Socket[] {
    const clients = this.server ? [...this.server.sockets.sockets.values()] : [];
    return clients.filter(client => this.isClientAUser(client));
  }

  /**
   * Get a list of clients that are NOT in the user room, these are the ledstrips
   * @private
   */
  private get ledstripClients(): Socket[] {
    const clients = this.server ? [...this.server.sockets.sockets.values()] : [];
    return clients.filter(client => this.isClientALedstrip(client));
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
   * Get the state of the network containing all rooms and devices
   */
  async getNetworkState(): Promise<INetworkState>{
    const rooms = await this.roomService.findAll();
    return {
      rooms: rooms,
      devices: await this.deviceService.findAll({where: {room: null}})
    }
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
  async joinUserRoom(client: Socket) {
    client.join('user');
    // delete this device from the database because it is now a user
    await this.deviceService.update(client.conn.remoteAddress, {isLedstrip: false});
    this.logger.log(`The client ${client.conn.remoteAddress} registered as a user`);
  }

  /**
   * This function is called when a client connects to the server
   * @param client
   * @param server
   */
  onConnect(client: Socket, server: Server) {
    console.dir(client.handshake)
    this.logger.log(`Client connected. IP: ${client.handshake.address}`);
    this.server = server;

    const deviceName = client.handshake.query.deviceName;
    // If no device name was provided, disconnect the client
    if(!deviceName || typeof deviceName !== 'string' || Array.isArray(deviceName)) {
      this.logger.warn(`Client ${client.conn.remoteAddress} provided an invalid device name. Received: ${deviceName}. Disconnecting...`)
      client.disconnect(true);
      return;
    }

    // Let's check if this client is already registered in the database.
    // If not, we add it.
    // We do not know yet if the connected is a user or a ledstrip because by default you connect to the default namespace
    // When a client connects as a user it will delete itself from the database. @see joinUserRoom
    this.deviceService.addIfNotExists(deviceName, {
      state: this._state,
      isConnected: true,
    }).then(wasAdded => {
      if (wasAdded) {
        this.logger.log(`Device ${client.conn.remoteAddress} was added to the database`);
      } else {
        this.logger.log(`Device ${client.conn.remoteAddress} was already registered in the database`);
      }
    });
  }


  /**
   * This function is called when a client disconnects from the server
   * @param client
   * @param server
   */
  onDisconnect(client: Socket, server: Server) {
    this.logger.log(`Client disconnected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.deviceService.update(client.conn.remoteAddress, {isConnected: false}).then();
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
