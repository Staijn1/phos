import {Injectable} from '@angular/core';
import {Connection} from '../../interfaces/Connection';
import {iroColorObject} from '../../types/types';
import {WebsocketService} from '../websocketconnection/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService extends Connection {

  constructor(private websocketService: WebsocketService) {
    super();
  }

  decreaseBrightness(): void {
    this.websocketService.decreaseBrightness();
  }

  decreaseSpeed(): void {
    this.websocketService.decreaseSpeed();
  }

  increaseBrightness(): void {
    this.websocketService.increaseBrightness();
  }

  increaseSpeed(): void {
    this.websocketService.increaseSpeed();
  }

  protected send(command: string): void {
    throw Error('Not implemented');
  }

  setColor(colors: iroColorObject[] | string[]): void {
    this.websocketService.setColor(colors);
  }

  setLeds(amount: number): void {
    this.websocketService.setLeds(amount);
  }

  setMode(mode: number): void {
    this.websocketService.setMode(mode);
  }
}
