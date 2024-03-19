import {Injectable, Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {INetworkState, RoomsState, RoomState, WebsocketMessage} from '@angulon/interfaces';
import {DeviceService} from '../device/device.service';
import {RoomService} from '../room/room.service';
import {OnEvent} from '@nestjs/event-emitter';
import {first} from 'rxjs';


@Injectable()
export class WebsocketService {
  private server: Server | undefined;
  /**
   * This variable is the primary state, which will be sent to all ledstrips and users
   */
  private logger: Logger = new Logger(WebsocketService.name);

  constructor(private readonly deviceService: DeviceService, private readonly roomService: RoomService) {
  }

  @OnEvent('database-change')
  onDatabaseChange() {
    this.logger.log('Database changed. Updating all user clients')
    this.emitEventToAllUsers(WebsocketMessage.DatabaseChange, null)
  }

  /**
   * Set the received state on the server and send it to all ledstrips
   * @param rooms The rooms to send the state to
   * @param newState The new state to set
   * @param originClient The client that sent the new state
   */
  async setState(rooms: string[], newState: RoomState, originClient: Socket) {
    this.roomService.updateRoomStateForRoomsSubject.next({ rooms: rooms, newState: newState });

    const roomsState: RoomsState = {};
    rooms.forEach(room => roomsState[room] = newState);

    await this.sendStateToRooms(rooms, false, roomsState);
    this.emitEventToAllUsers(WebsocketMessage.StateChange, newState, originClient);
  }

  /**
   * Get the state of the network containing all rooms and devices
   */
  async getNetworkState(): Promise<INetworkState> {
    const rooms = await this.roomService.findAll({order: {name: 'ASC'}});
    return {
      rooms: rooms,
      devices: await this.deviceService.findAll({where: {room: null}, relations: ['room'], order: {name: 'ASC'}})
    }
  }

  /**
   * Set the FFTValue on the ledstrips
   * @param payload
   */
  setFFTValue(rooms: string[], payload: number): void {
    for (const room of rooms) {
      this.sendEventToAllLedstripsInRoom(room, WebsocketMessage.LedstripFFT, payload.toString());
    }
  }

  /**
   * Send the set ledstrip state to specified rooms (and all clients connected to those rooms)
   * @param rooms Rooms to send the state to
   * @param force If true the ledstrips will update their state even if it's the same as the current state. Default is false
   * @param state The state to send. If not provided, the state will be fetched from the database
   */
  async sendStateToRooms(rooms: string[], force = false, state?: RoomsState): Promise<void> {
    if (!state) {
      state = await this.roomService.getRoomsState(rooms);
    }

    for (const room of rooms) {
      this.logger.log(`Sending state to all ledstrips in room ${room}. Force: ${force}. State: ${JSON.stringify(state[room])}`);
      this.sendEventToAllLedstripsInRoom(room, WebsocketMessage.LedstripSetState, {...state[room], force: force});
    }
  }

  /**
   * Make the client join a room that is only for users - not ledstrips. This way we can distinguish clients from being a user or a ledstrip
   * @param client
   */
  async joinUserRoom(client: Socket) {
    client.join('user');
    // delete this device from the database because it is now a user
    await this.deviceService.updateOne({socketSessionId: client.id}, {isLedstrip: false});
    this.logger.log(`The client ${client.id} registered as a user`);
  }

  /**
   * This function is called when a client connects to the server
   * @param client
   * @param server
   */
  async onConnect(client: Socket, server: Server) {
    this.logger.log(`Client is connecting. Session: ${client.id}`);
    this.server = server;

    const deviceName = client.handshake.query.deviceName;
    const ledCount = client.handshake.query.ledCount as string | undefined;
    // If no device name was provided, disconnect the client
    if (!deviceName || typeof deviceName !== 'string' || Array.isArray(deviceName)) {
      this.logger.warn(`Client with session ${client.id} provided an invalid device name. Received: ${deviceName}. Disconnecting...`)
      client.disconnect(true);
      return;
    }

    // If the received ledcount is not a number, disconnect the client
    if (ledCount && isNaN(parseInt(ledCount))) {
      this.logger.warn(`Client with session ${client.id} provided an invalid ledCount. Received: ${ledCount}. Disconnecting...`)
      client.disconnect(true);
      return;
    }

    const deviceInDb = await this.deviceService.findOne({where: {name: deviceName}, relations: ['room']});

    // If the device is already in the database, update the socketSessionId and isConnected fields. Also join the room if it is in one
    if (deviceInDb) {
      await this.deviceService.updateOne({name: deviceName}, {socketSessionId: client.id, isConnected: true, ledCount: ledCount ? parseInt(ledCount) : 0});

      if (deviceInDb.room) {
        client.join(deviceInDb.room.id);
        this.logger.log(`Device ${deviceName}(${client.id}) was in room ${deviceInDb.room.name}(${deviceInDb.room.id}) and has now joined the room.`);

      }

      this.logger.log(`Client ${client.id} finished reconnecting successfully with name ${deviceName}`);
      return;
    }

    await this.deviceService.create({
      name: deviceName,
      socketSessionId: client.id,
      isConnected: true,
      // Initially, we assume that the client is a ledstrip. If it is not, it will be updated later because the user-interface will emit the RegisterAsUser event
      // The ledstrips do not.
      isLedstrip: true
    });

    this.logger.log(`Client ${client.id} finished connecting successfully with name ${deviceName}`);
  }


  /**
   * This function is called when a client disconnects from the server
   * @param client
   * @param server
   */
  onDisconnect(client: Socket, server: Server) {
    this.logger.log(`Client ${client.id} went offline`);
    this.deviceService.updateOne({socketSessionId: client.id}, {isConnected: false}).then();
    this.server = server;
  }

  /**
   * Send a message to all users except the one that sent the message
   * @param {string} event
   * @param {string[]} payload
   * @param {Socket} originClient
   * @private
   */
  private emitEventToAllUsers(event: WebsocketMessage, payload: RoomState, originClient?: Socket) {
    // If the originClient exists, send the event to all users except the originClient
    if (originClient) {
      originClient.broadcast.to('user').emit(event, payload);
      return;
    }

    // If the originClient does not exist, send the event to all users
    this.server.to('user').emit(event, payload);
  }

  /**
   * Send an event to all ledstrips with a given payload
   * @param room Id of the room to send the event to
   * @param event Event to emit on the ledstrip
   * @param payload Payload to send with the event
   * @private
   */
  private sendEventToAllLedstripsInRoom(room: string, event: WebsocketMessage, payload: unknown) {
    this.server.to(room).emit(event, payload);
  }

  /**
   * Moves a client with a given deviceName to a new websocket room (with the given room Id)
   * First, we query the database to find the device with the given name.
   * Then we check if the device is assigned to a room. If so, we look up the websocket client by session id.
   * If the client is found we make the websocket client join the new room so messages can be sent to it.
   * @param deviceName
   * @param roomId
   */
  async moveDeviceToRoom(deviceName: string, roomId: string) {
    const deviceInDb = await this.deviceService.findOne({where: {name: deviceName}, relations: ['room']});

    if (deviceInDb.room) {
      const client = this.server?.sockets.sockets.get(deviceInDb.socketSessionId);
      if (client) {
        client.leave(deviceInDb.room.id);
        client.join(roomId);
        this.logger.log(`Client ${deviceInDb.name}(${deviceInDb.socketSessionId}) moved to room ${deviceInDb.room.name}(${roomId})`);

        await this.setState([roomId], deviceInDb.room.state, client);
        this.logger.log(`Sent state to room ${roomId} after moving client ${deviceInDb.name}(${deviceInDb.socketSessionId})`);
      }
    }
  }
}
