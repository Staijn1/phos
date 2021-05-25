import {Injectable} from '@angular/core';
import {Connection} from '../../interfaces/Connection';
import {environment} from '../../../environments/environment';
import {iroColorObject} from '../../types/types';
import {ModeInformation} from '../../types/ModeInformation';
import {GradientInformation} from '../../types/GradientInformation';

@Injectable({
    providedIn: 'root'
})
export class HTTPConnectionService extends Connection {
    readonly url = environment.url;

    constructor() {
        super();
    }

    decreaseBrightness(): void {
        fetch(`${this.url}/brightness/decrease`, {
            method: 'POST'
        }).then(response => this.handleError(response));
    }

    decreaseSpeed(): void {
        fetch(`${this.url}/speed/decrease`, {
            method: 'POST'
        }).then(response => this.handleError(response));
    }

    increaseBrightness(): void {
        fetch(`${this.url}/brightness/increase`, {
            method: 'POST'
        }).then(response => this.handleError(response));
    }

    increaseSpeed(): void {
        fetch(`${this.url}/speed/increase`, {
            method: 'POST'
        }).then(response => {
            this.handleError(response);
        });
    }

    protected send(command: string): void {
        throw Error('Not implemented');
    }

    setColor(colors: iroColorObject[] | string[]): void {
        const formattedColors = [];
        for (const color of colors) {
            let colorstring: string;
            if (typeof color === 'object') {
                colorstring = color.hexString;
            } else {
                colorstring = color;
            }

            formattedColors.push(colorstring.substring(1, colorstring.length));
        }
        fetch(`${this.url}/color`, {
            method: 'POST',
            body: JSON.stringify({color: formattedColors}),
            headers: {'Content-Type': 'application/json'}
        }).then(response => this.handleError(response));
    }

    setLeds(amount: number): void {
        throw new Error('Not implemented');
    }

    setMode(mode: number): void {
        fetch(`${this.url}/mode`, {
            method: 'POST',
            body: JSON.stringify(mode),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            this.handleError(response);
        });
    }

    private handleError(response: Response): void {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    }

    async getModes(): Promise<ModeInformation> {
        const response = await fetch(`${this.url}/mode`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.handleError(response);
        return response.json();
    }

    async getGradients(): Promise<GradientInformation[]> {
        const response = await fetch(`${this.url}/visualizer/gradients`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.handleError(response);
        return response.json();
    }
}
