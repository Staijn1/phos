import {Injectable} from '@angular/core';
import {BaseChromaConnection} from "./base-chroma-connection.service";
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebsocketChromaConnectionService extends BaseChromaConnection {
  private connection!: Socket;

  getChromaSDKUrl(): string {
    return "wss://chromasdk.io:13339/razer/chromasdk";
  }

  /**
   * Connects to the Razer chroma SDK and registers this application
   */
  initialize(): Promise<void> {
/*    const socket = new WebSocket("wss://localhost:13339/razer/chromasdk");
    // create socket
    this.connection = io(this.getChromaSDKUrl(), {
      transports: ['websocket'],
      reconnectionAttempts: 5
    });

    this.connection.on('connect', () => {
      console.log('Opened websocket at', this.getChromaSDKUrl());
      this.connection.send(JSON.stringify(this.APPLICATION_DATA));
    });

    this.connection.on('connect_error', (error: Error) => {
      console.error(`Failed to connect to websocket at ${this.getChromaSDKUrl()}`, error);
      this.messageService.setMessage(error);
    });*/


    return Promise.reject("Not implemented");
  }

  performHeartbeat(): Promise<void> {
    return Promise.reject("Not implemented");
  }

  unInitialize(): Promise<void> {
    return Promise.reject("Not implemented");
  }

  override call(endpoint: string, payload: unknown): Promise<unknown> {
    return Promise.reject("Not implemented");
  }
}