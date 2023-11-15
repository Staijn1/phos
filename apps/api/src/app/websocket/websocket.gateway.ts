import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {ConfigurationService} from '../configuration/configuration.service';
import {
  GradientInformation,
  INetworkState,
  IRoom,
  LedstripState,
  ModeInformation,
  WebsocketMessage
} from '@angulon/interfaces';
import {WebsocketService} from './websocket.service';
import {RoomService} from '../room/room.service';
import {Room} from '../room/Room.model';
import {ObjectId} from 'typeorm';
import {DeviceService} from '../device/device.service';

@WebSocketGateway(undefined, {cors: true})
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
  async createRoom(client: Socket, payload: Partial<Room>): Promise<IRoom> {
    return this.roomService.create(payload);
  }

  @SubscribeMessage(WebsocketMessage.RemoveRoom)
  async removeRoom(client: Socket, payload: ObjectId): Promise<void> {
    return this.roomService.remove({where: {id: payload}});
  }

  @SubscribeMessage(WebsocketMessage.GetLedstripState)
  getLedstripState(): LedstripState {
    return this.websocketService.getState();
  }

  @SubscribeMessage(WebsocketMessage.SetNetworkState)
  onSetNetworkState(client: Socket, payload: LedstripState): LedstripState {
    this.websocketService.setState(payload, client);
    return this.websocketService.getState();
  }

  @SubscribeMessage(WebsocketMessage.SetFFTValue)
  onFFTCommand(client: Socket, payload: number): LedstripState {
    this.websocketService.setFFTValue(payload);
    return this.websocketService.getState();
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
  async onJoinUserRoom(client: Socket): Promise<LedstripState> {
    this.websocketService.joinUserRoom(client);
    return this.websocketService.getState();
  }

  /**
   * When a client connects, log its IP address.
   * Also set the server instance in the websocketService, so we make sure it is always up-to-date with the current server instance.
   * @param {Socket} client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]): void {
    this.websocketService.onConnect(client, this.server);
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
    setInterval(() => {
      this.logger.log('Sending state to all ledstrips - forced');
      this.websocketService.setStateOnAllLedstrips(true);
    }, this.stateIntervalTimeMS);
  }
}
