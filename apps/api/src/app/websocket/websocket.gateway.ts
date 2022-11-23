import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {WebsocketClientsManagerService} from './websocket-clients-manager.service';

@WebSocketGateway(undefined, {cors: true})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('WebsocketGateway');

  constructor(private readonly websocketClientsManagerService: WebsocketClientsManagerService) {
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

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.websocketClientsManagerService.setServer(this.server);
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.websocketClientsManagerService.setServer(this.server);
  }

  afterInit(server: any): any {
    this.websocketClientsManagerService.setServer(this.server)
  }
}
