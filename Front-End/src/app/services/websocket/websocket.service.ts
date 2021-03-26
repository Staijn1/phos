import {Injectable} from '@angular/core';
import {iroColorObject} from '../../types/types';
import {map} from '../../shared/functions';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    websocketUrls = ['ws://bed.local:81'];
    sockets: WebSocket[] = [];
    private retryTimeout: NodeJS.Timeout;

    constructor() {
        this.websocketUrls.forEach((value, index) => {
            const socket = new WebSocket(value);
            socket.onopen = (event: any) => {
                console.log(`Opened websocket at ${event.currentTarget.url}`);
            };

            socket.onerror = (event: any) => {
                console.log('ws error', event);
            };
            this.sockets.push(socket);
        });
    }

    setColor(colors: iroColorObject[]): void {
        const formattedColors = [];
        for (const color of colors) {
            formattedColors.push(color.hexString.substring(1, color.hexString.length));
        }
        this.sendAll(`c ${formattedColors[0]},${formattedColors[1]},${formattedColors[2]}`);
    }

    private sendAll(payload: string): void {
        this.sockets.forEach((socket, index) => {
            if (this.isOpen(socket)) {
                socket.send(payload);
            } else {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = setTimeout(() => {
                    const newWebsocket = new WebSocket(this.websocketUrls[index]);
                    newWebsocket.onerror = (event: any) => {
                        console.log('ws error', event);
                    };
                    newWebsocket.onopen = (event: any) => {
                        console.log(`Reopened websocket at ${event.currentTarget.url}`);
                    };
                    this.sockets[index] = newWebsocket;
                }, 7500);
            }
        });
    }

    setMode(modeNumber: number): void {
        this.sendAll(`m ${modeNumber}`);
    }

    isOpen(websocket: WebSocket): boolean {
        return websocket.readyState === websocket.OPEN;
    }

    decreaseBrightness(): void {
        this.sendAll('b');
    }

    increaseBrightness(): void {
        this.sendAll('B');
    }

    increaseSpeed(): void {
        this.sendAll('S');
    }

    decreaseSpeed(): void {
        this.sendAll('s');
    }

    setFFTValue(value: number): void {
        const mappedValue = map(value, 0, 1, 0, 255);
        this.sendAll(`v ${mappedValue}`);
    }
}
