import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import {Logger} from "@nestjs/common";
import {Socket, Server} from "socket.io";
import {WebsocketClientsManagerService} from "./websocket-clients-manager.service";

@WebSocketGateway(3334, {cors: true})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly websocketClientsManagerService: WebsocketClientsManagerService) {
  }

  private logger: Logger = new Logger('WebsocketGateway');

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
    this.websocketClientsManagerService.connectAll();
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected: ${client.id}. IP: ${client.conn.remoteAddress}`);
    this.websocketClientsManagerService.disconnectAll(this.server);
  }
}
