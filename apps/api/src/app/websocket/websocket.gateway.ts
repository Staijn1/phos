import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import {Logger} from "@nestjs/common";
import {Server, Socket} from "socket.io";

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('WebsocketGateway');

  @SubscribeMessage('message')
  onMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected: ${client.id}. IP: ${client.conn.remoteAddress}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected: ${client.id}. IP: ${client.conn.remoteAddress}`);
  }
}
