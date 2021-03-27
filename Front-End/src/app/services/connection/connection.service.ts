import {Injectable} from '@angular/core';
import {Connection} from '../../interfaces/Connection';
import {iroColorObject} from '../../types/types';
import {WebsocketService} from '../websocket/websocket.service';
import {SerialConnectionService} from '../serial/serial-connection.service';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService extends Connection {

    constructor(private readonly serialConnectionService: SerialConnectionService, private websocketService: WebsocketService) {
        super();
    }

    decreaseBrightness(): void {
        this.serialConnectionService.decreaseBrightness();
        this.websocketService.decreaseBrightness();
    }

    decreaseSpeed(): void {
        this.serialConnectionService.decreaseSpeed();
        this.websocketService.decreaseSpeed();
    }

    increaseBrightness(): void {
        this.serialConnectionService.increaseBrightness();
        this.websocketService.increaseBrightness();
    }

    increaseSpeed(): void {
        this.serialConnectionService.increaseSpeed();
        this.websocketService.increaseSpeed();
    }

    protected send(command: string): void {
        throw Error('Not implemented');
    }

    setColor(colors: iroColorObject[]): void {
        this.serialConnectionService.setColor(colors);
        this.serialConnectionService.setColor(colors);
    }

    setLeds(amount: number): void {
        this.serialConnectionService.setLeds(amount);
        this.websocketService.setLeds(amount);
    }

    setMode(mode: number): void {
        this.serialConnectionService.setMode(mode);
        this.websocketService.setMode(mode);
    }
}
