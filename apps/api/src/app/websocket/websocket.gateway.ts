import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { WebsocketClientsManagerService } from "./websocket-clients-manager.service";
import { ConfigurationService } from "../configuration/configuration.service";
import {
  AddGradientResponse,
  GradientInformation,
  LedstripState,
  ModeInformation
} from "@angulon/interfaces";
import { GradientsService } from "../gradients/gradients.service";

@WebSocketGateway(undefined, { cors: true })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("WebsocketGateway");
  // 15 minutes in milliseconds
  private readonly stateIntervalTimeMS = 900000;

  constructor(
    private readonly websocketClientsManagerService: WebsocketClientsManagerService,
    private readonly configurationService: ConfigurationService,
    private readonly gradientsService: GradientsService) {
  }

  @SubscribeMessage("getState")
  async onGetState(): Promise<LedstripState> {
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("mode")
  onModeCommand(client: Socket, payload: string): LedstripState {
    const mode = parseInt(payload, 10);
    this.websocketClientsManagerService.setMode(mode);
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("color")
  onColorCommand(client: Socket, payload: string[]): LedstripState {
    this.websocketClientsManagerService.setColor(payload, client);
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("FFT")
  onFFTCommand(client: Socket, payload: number): LedstripState {
    this.websocketClientsManagerService.setFFTValue(payload);
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("increaseBrightness")
  onIncreaseBrightnessCommand(): LedstripState {
    this.websocketClientsManagerService.increaseBrightness();
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("increaseSpeed")
  onIncreaseSpeedCommand(): LedstripState {
    this.websocketClientsManagerService.increaseSpeed();
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("decreaseBrightness")
  onDecreaseBrightnessCommand(): LedstripState {
    this.websocketClientsManagerService.decreaseBrightness();
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("decreaseSpeed")
  onDecreaseSpeedCommand(): LedstripState {
    this.websocketClientsManagerService.decreaseSpeed();
    return this.websocketClientsManagerService.getState();
  }

  @SubscribeMessage("getModes")
  async onGetModes(): Promise<ModeInformation[]> {
    return this.configurationService.getModes();
  }

  @SubscribeMessage("gradients/get")
  async onGetGradients(): Promise<GradientInformation[]> {
    return this.gradientsService.getGradients();
  }

  @SubscribeMessage("joinUserRoom")
  async onJoinUserRoom(client: Socket): Promise<void> {
    this.websocketClientsManagerService.joinUserRoom(client);
  }

  /**
   * This event is emitted by a ledstrip, just after it connected to the server.
   * The websocket client manager will process this new state.
   * If no other ledstrip is connected, it will set the state of the new ledstrip as the new state of the server.
   * If another ledstrip is connected, it will set the state of the new ledstrip to the state of the server.
   * @param client
   * @param payload
   */
  @SubscribeMessage("submitState")
  async onRegisterState(client: Socket, payload: LedstripState): Promise<void> {
    this.websocketClientsManagerService.syncState(client, payload);
  }

  /**
   * When a client connects, log its IP address.
   * Also set the server instance in the websocketClientsManagerService, so we make sure it is always up-to-date with the current server instance.
   * @param {Socket} client
   * @param args
   * @returns {any}
   */
  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.websocketClientsManagerService.setServer(this.server);
  }

  /**
   * When a client disconnects, log its IP address and that it has disconnected.
   * Just like the handleConnection method, we set the server instance again on the websocketClientsManagerService.
   * @param {Socket} client
   * @returns {any}
   */
  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.websocketClientsManagerService.setServer(this.server);
  }

  /**
   * Start a timer that will send the state of the server to all connected ledstrips every x time.
   */
  afterInit(): void {
    setInterval(() => {
      this.logger.log("Sending state to all ledstrips - forced");
      this.websocketClientsManagerService.setStateOnAllLedstrips(true);
    }, this.stateIntervalTimeMS);
  }
}
