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

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  constructor(private readonly websocketClientsManagerService: WebsocketClientsManagerService) {
  }

  private logger: Logger = new Logger('WebsocketGateway');

  @SubscribeMessage('mode')
  onMode(client: Socket, payload: number): string {
    this.websocketClientsManagerService.setMode(payload);
    return 'OK';
  }

  @SubscribeMessage('brightness/increase')
  onBrightnessIncrease(client: Socket, payload: number): string {
    this.websocketClientsManagerService.increaseBrightness();
    return 'OK';
  }

  @SubscribeMessage('brightness/decrease')
  onBrightnessDecrease(client: Socket, payload: number): string {
    this.websocketClientsManagerService.decreaseBrightness();
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
