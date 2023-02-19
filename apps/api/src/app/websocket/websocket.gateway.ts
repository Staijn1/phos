import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Logger} from "@nestjs/common";
import {Server, Socket} from "socket.io";
import {WebsocketClientsManagerService} from "./websocket-clients-manager.service";
import {ConfigurationService} from "../configuration/configuration.service";
import {AddGradientResponse, GradientInformation, ModeInformation} from "@angulon/interfaces";
import {ModeStatisticsDbService} from "../database/mode-statistics/mode-statistics-db.service";
import {GradientsService} from "../gradients/gradients.service";

@WebSocketGateway(undefined, { cors: true })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("WebsocketGateway");

  constructor(
    private readonly websocketClientsManagerService: WebsocketClientsManagerService,
    private readonly configurationService: ConfigurationService,
    private readonly modeStatisticsService: ModeStatisticsDbService,
    private readonly gradientsService: GradientsService) {
  }

  @SubscribeMessage("mode")
  async onModeCommand(client: Socket, payload: string): Promise<string> {
    try {
      const mode = parseInt(payload, 10);
      this.websocketClientsManagerService.setMode(mode);
      await this.modeStatisticsService.registerModeChange(mode);
      return "OK";
    } catch (e) {
      this.logger.error(e);
      return "ERROR";
    }
  }

  @SubscribeMessage("color")
  onColorCommand(client: Socket, payload: string[]): string {
    this.websocketClientsManagerService.setColor(payload, client);
    return "OK";
  }

  @SubscribeMessage("FFT")
  onFFTCommand(client: Socket, payload: number): string {
    this.websocketClientsManagerService.setFFTValue(payload);
    return "OK";
  }

  @SubscribeMessage("increaseBrightness")
  onIncreaseBrightnessCommand(): string {
    this.websocketClientsManagerService.increaseBrightness();
    return "OK";
  }

  @SubscribeMessage("increaseSpeed")
  onIncreaseSpeedCommand(): string {
    this.websocketClientsManagerService.increaseSpeed();
    return "OK";
  }

  @SubscribeMessage("decreaseBrightness")
  onDecreaseBrightnessCommand(): string {
    this.websocketClientsManagerService.decreaseBrightness();
    return "OK";
  }

  @SubscribeMessage("decreaseSpeed")
  onDecreaseSpeedCommand(): string {
    this.websocketClientsManagerService.decreaseSpeed();
    return "OK";
  }

  @SubscribeMessage("getModes")
  async onGetModes(): Promise<ModeInformation[]> {
    return this.configurationService.getModes();
  }

  @SubscribeMessage("gradients/get")
  async onGetGradients(): Promise<GradientInformation[]> {
    return this.gradientsService.getGradients();
  }

  @SubscribeMessage("gradients/edit")
  async onGradientsEdit(client: Socket, payload: GradientInformation): Promise<GradientInformation[]> {
    await this.gradientsService.editGradient(payload);
    return this.gradientsService.getGradients();
  }

  @SubscribeMessage("gradients/delete")
  async onDeleteGradient(client: Socket, payload: { id: number }): Promise<GradientInformation[]> {
    await this.gradientsService.deleteGradient(payload);
    return this.gradientsService.getGradients();
  }

  @SubscribeMessage("gradients/add")
  async onAddGradient(): Promise<AddGradientResponse> {
    return this.gradientsService.addGradient();
  }

  @SubscribeMessage("joinUserRoom")
  async onJoinUserRoom(client: Socket): Promise<void> {
    this.websocketClientsManagerService.joinUserRoom(client);
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
}
