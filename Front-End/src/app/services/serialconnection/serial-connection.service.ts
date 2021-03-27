import {ElectronService} from '../electron/electron.service';
import {Injectable} from '@angular/core';
import {ChromaEffectService} from '../chromaEffect/chroma-effect.service';
import {SettingsService} from '../settings/settings.service';
import {iroColorObject} from '../../types/types';
import {map} from '../../shared/functions';
import {Connection} from '../../interfaces/Connection';

@Injectable({
    providedIn: 'root'
})
export class SerialConnectionService extends Connection {
    public port: any;
    public selectedPortId: string;
    public portOpts = {baudRate: 9600, autoOpen: true};
    private _previousVisualizerLeds = 0;
    serialConnectionError: string;

    constructor(public electronService: ElectronService, private settingsService: SettingsService, private chromaService: ChromaEffectService) {
        super();
        this.readSettings();
        this.openPort();
    }

    scan(): Promise<any> {
        this.selectedPortId = '';
        return this.electronService.serialPort.list();
    }

    openPort(): void {
        if (this.port === undefined) {
            this.port = new this.electronService.serialPort(
                this.selectedPortId,
                this.portOpts,
                err => {
                    if (err) {
                        this.handleError(err);
                    }
                }
            );
        }

        this.port.on('open', err => {
            if (err) {
                this.handleError(err);
            }

            setTimeout(() => {
                // @ts-ignore
                this.setColor(this.settingsService.readGeneralSettings().colors[0]);
            }, 500);

        });
        this.port.on('error', err => {
            if (err) {
                this.handleError(err);
            }
        });

        if (!this.port.isOpen) {
            this.port.open(err => {
                if (err) {
                    this.handleError(err);
                }
            });
        }
        let buffer = '';
        this.port.on('data', (data) => {
            buffer += data.toString();

            if (buffer.indexOf('}') !== -1) {
                try {
                    this.handleJson(buffer);
                } catch (err) {
                    this.handleError(err);
                }
                buffer = '';
            }
        });
    }

    closePort(): void {
        this.port.close(err => {
            if (err) {
                this.handleError(err);
            }
        });
        this.selectedPortId = null;
    }

    send(command: string): void {
        this.port.write(command + '\n', (err) => {
            if (err) {
                this.handleError(err);
            }
        });
    }

    setLeds(amount: number): void {
        const mappedAmount = Math.floor(map(amount, 0, 1, 0, 255));
        if (this._previousVisualizerLeds === mappedAmount) {
            return;
        }
        this._previousVisualizerLeds = mappedAmount;
        this.send(`setLeds ${mappedAmount}`);
    }

    setMode(mode: number): void {
        this.send(`setMode ${mode}`);
    }

    setColor(colors: iroColorObject[]): void {
        const formattedColors = [];
        for (const color of colors) {
            formattedColors.push(color.hexString.substring(1, color.hexString.length));
        }
        this.send(`setColor ${formattedColors[0]},${formattedColors[1]},${formattedColors[2]}`);
    }

    update(): void {
        this.closePort();
        this.readSettings();
        setTimeout(() => {
            this.openPort();
        }, 1000);
    }

    decreaseBrightness(): void {
        this.send('decreaseBrightness');
    }

    increaseBrightness(): void {
        this.send('increaseBrightness');
    }

    decreaseSpeed(): void {
        this.send('decreaseSpeed');
    }

    increaseSpeed(): void {
        this.send('increaseSpeed');
    }

    private handleError(err: Error): Error {
        return new Error('[ERR] Error opening port: ' + err.message);
    }

    private readSettings(): void {
        this.selectedPortId = this.settingsService.readGeneralSettings().com;
    }

    private handleJson(buffer: string): void {
        const json = JSON.parse(buffer);
        if (json.hasOwnProperty('speed')) {
            this.chromaService.speed = json.speed;
        }
    }
}
