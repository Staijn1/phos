import {OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {ConfigurationService} from '../configuration/configuration.service';
import {
  GradientInformation,
  INetworkState,
  IRoom,
  RoomState,
  ModeInformation,
  StandardResponse,
  WebsocketMessage,
  WebsocketRequest
} from '@angulon/interfaces';
import {WebsocketService} from './websocket.service';
import {RoomService} from '../room/room.service';
import {Room} from '../room/Room.model';
import {DeviceService} from '../device/device.service';

@WebSocketGateway(undefined, {cors: true, pingInterval: 5000})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger(WebsocketGateway.name);
  // 15 minutes in milliseconds
  private readonly stateIntervalTimeMS = 900000;

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly roomService: RoomService,
    private readonly deviceService: DeviceService,
    private readonly configurationService: ConfigurationService) {
  }

  @SubscribeMessage(WebsocketMessage.GetNetworkState)
  async getNetworkState(): Promise<INetworkState> {
    return this.websocketService.getNetworkState();
  }

  @SubscribeMessage(WebsocketMessage.CreateRoom)
  async createRoom(client: Socket, body: WebsocketRequest<Partial<Room>>): Promise<IRoom> {
    return this.roomService.create(body.payload);
  }

  @SubscribeMessage(WebsocketMessage.RemoveRoom)
  async removeRoom(client: Socket, body: WebsocketRequest<string>): Promise<StandardResponse> {
    await this.roomService.remove({where: {name: body.payload}});
    return {status: 200, message: 'Room removed'};
  }

  @SubscribeMessage(WebsocketMessage.AssignDeviceToRoom)
  async assignDeviceToRoom(client: Socket, body: WebsocketRequest<{ deviceName: string, roomName: string }>): Promise<StandardResponse> {
    try {
      const room = await this.roomService.moveDeviceToRoom(body.payload.deviceName, body.payload.roomName);
      await this.websocketService.moveDeviceToRoom(body.payload.deviceName, room.id);
      this.logger.log(`Device ${body.payload.deviceName} assigned to room ${body.payload.roomName}`);
      return {status: 200, message: 'Device assigned to room'};
    } catch (error) {
      this.logger.error(`Failed to assign device to room: ${error.message}`);
      return {status: 500, message: 'Failed to assign device to room'};
    }
  }

  @SubscribeMessage(WebsocketMessage.RenameDevice)
  async renameDevice(client: Socket, body: WebsocketRequest<string>): Promise<void> {
    return this.deviceService.renameDevice(client.id, body.payload);
  }

  @SubscribeMessage(WebsocketMessage.SetNetworkState)
  async onSetNetworkState(client: Socket, body: WebsocketRequest<RoomState>): Promise<INetworkState> {
    await this.websocketService.setState(body.rooms, body.payload, client);
    return this.websocketService.getNetworkState();
  }

  @SubscribeMessage(WebsocketMessage.SetNetworkStateRaw)
  async onSetNetworkStateRaw(client: Socket, body: WebsocketRequest<RoomState>): Promise<string> {
    await this.websocketService.setStateRaw(body.rooms, body.payload);
    // Return value does not matter but front-end expects a reply otherwise it thinks it's not connected.
    return "OK";
  }

  @SubscribeMessage(WebsocketMessage.SetFFTValue)
  onFFTCommand(client: Socket, body: WebsocketRequest<number>): string {
    this.websocketService.setFFTValue(body.rooms, body.payload);
    // Return value does not matter but front-end expects a reply otherwise it thinks it's not connected.
    return "OK";
  }

  @SubscribeMessage(WebsocketMessage.GetModes)
  async onGetModes(): Promise<ModeInformation[]> {
    return this.configurationService.getModes();
  }

  @SubscribeMessage(WebsocketMessage.GetGradients)
  async onGetGradients(): Promise<GradientInformation[]> {
    return this.configurationService.getGradients();
  }

  @SubscribeMessage(WebsocketMessage.RegisterAsUser)
  async onRegisterAsUser(client: Socket): Promise<StandardResponse> {
    await this.websocketService.joinUserRoom(client);
    return {status: 200, message: 'Joined user room'};
  }

  @SubscribeMessage(WebsocketMessage.GetPowerDrawEstimate)
  async onGetPowerDrawEstimate(): Promise<Record<string, number>> {
    return this.deviceService.estimatePowerDrawForAllOnlineLedstrips();
  }

  /**
   * When a client connects, log its IP address.
   * Also set the server instance in the websocketService, so we make sure it is always up-to-date with the current server instance.
   * @param {Socket} client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]): void {
    this.websocketService.onConnect(client, this.server).then();
  }

  /**
   * When a client disconnects, log its IP address and that it has disconnected.
   * Just like the handleConnection method, we set the server instance again on the websocketService.
   * @param {Socket} client
   */
  handleDisconnect(client: Socket): void {
    this.websocketService.onDisconnect(client, this.server);
  }

  /**
   * Start a timer that will send the state of the server to all connected ledstrips every x time to keep them in sync.
   */
  afterInit(): void {
    setInterval(async () => {
      const allRooms = await this.roomService.findAll();

      this.logger.log(`[SCHEDULED] Sending state to all rooms - forced. Rooms: ${allRooms.map(r => `${r.name} (${r.id})`).join(', ')}`);

      const allRoomIds = allRooms.map(r => r.id);
      this.websocketService.sendStateToRooms(allRoomIds,true).then();
    }, this.stateIntervalTimeMS);
  }
}
