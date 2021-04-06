import {Injectable} from '@angular/core';
import {iroColorObject} from '../../types/types';
import {map} from '../../shared/functions';
import {Connection} from '../../interfaces/Connection';
import ReconnectingWebSocket from 'reconnecting-websocket';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService extends Connection {
    websocketUrls = ['ws://bed.local:81'];
    sockets: ReconnectingWebSocket[] = [];

    constructor() {
        super();
        setTimeout(() => {
            this.websocketUrls.forEach((value, index) => {
                const socket = new ReconnectingWebSocket(value);
                socket.onopen = (ev: Event) => {
                    console.log(`Opened websocket at`, (ev.currentTarget as WebSocket).url);
                };
                this.sockets.push(socket);
            });
        }, 1000);
    }

    setColor(colors: iroColorObject[] | string[]): void {
        const formattedColors = [];
        for (const color of colors) {
            const colorstring: string = ((color as iroColorObject).hexString ? (color as iroColorObject).hexString : color) as string;
            formattedColors.push(colorstring.substring(1, colorstring.length));
        }
        this.send(`c ${formattedColors[0]},${formattedColors[1]},${formattedColors[2]}`);
    }

    send(payload: string): void {
        this.sockets.forEach((socket, index) => {
            if (this.isOpen(socket)) {
                socket.send(payload);
            }
        });
    }

    setMode(modeNumber: number): void {
        this.send(`m ${modeNumber}`);
    }

    isOpen(websocket: ReconnectingWebSocket): boolean {
        return websocket.readyState === websocket.OPEN;
    }

    decreaseBrightness(): void {
        this.send('b');
    }

    increaseBrightness(): void {
        this.send('B');
    }

    increaseSpeed(): void {
        this.send('S');
    }

    decreaseSpeed(): void {
        this.send('s');
    }

    setLeds(value: number): void {
        const mappedValue = map(value, 0, 1, 0, 255);
        this.send(`v ${mappedValue}`);
    }
}
