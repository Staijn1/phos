import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {WebsocketClientsManagerService} from './websocket-clients-manager.service';
import {ConfigurationService} from '../configuration/configuration.service';
import {GradientInformation, ModeInformation} from '@angulon/interfaces';

@WebSocketGateway(undefined, {cors: true})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('WebsocketGateway');

  constructor(private readonly websocketClientsManagerService: WebsocketClientsManagerService, private configurationService: ConfigurationService) {
  }

  @SubscribeMessage('mode')
  onModeCommand(client: Socket, payload: number): string {
    this.websocketClientsManagerService.setMode(payload);
    return 'OK';
  }

  @SubscribeMessage('color')
  onColorCommand(client: Socket, payload: string): string {
    this.websocketClientsManagerService.setColor(payload);
    return 'OK';
  }

  @SubscribeMessage('FFT')
  onFFTCommand(client: Socket, payload: number): string {
    this.websocketClientsManagerService.setFFTValue(payload);
    return 'OK';
  }

  @SubscribeMessage('brightness')
  onBrightnessCommand(client: Socket, payload: number): string {
    this.websocketClientsManagerService.setBrightness(payload);
    return 'OK';
  }

  @SubscribeMessage('speed')
  onSpeedCommand(client: Socket, payload: number): string {
    this.websocketClientsManagerService.setSpeed(payload);
    return 'OK';
  }

  @SubscribeMessage('getModes')
  async onGetModes(): Promise<ModeInformation[]> {
    return this.configurationService.getModes();
  }

  @SubscribeMessage('getGradients')
  async onGetGradients(): Promise<GradientInformation[]> {
    return this.configurationService.getGradients();
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
