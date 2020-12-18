import {ElectronService} from '../electron/electron.service';
import {Injectable} from '@angular/core';
import {ChromaEffectService} from '../chromaEffect/chroma-effect.service';
import {SettingsService} from '../settings/settings.service';

@Injectable({
    providedIn: 'root'
})
export class SerialConnectionService {
    public port: any;
    public selectedPortId: string;
    public portOpts = {baudRate: 19200, autoOpen: true};
    public amountOfLeds = 30;
    private _previousVisualizerLeds = 0;
    serialConnectionError: string;

    constructor(public electronService: ElectronService, private settingsService: SettingsService, private chromaService: ChromaEffectService) {
        this.readSettings();
        this.openPort();
    }

    scan(): Promise<any> {
        this.selectedPortId = '';
        return this.electronService.serialPort.list();
    }

    getPort($event): void {
        console.log('[LOG] Selected port ID: ', $event.target.textContent);
        this.selectedPortId = $event.target.textContent;
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
                    // self._errorMessage = self.setErrorMessage('Kan JSON niet inlezen\n' + e);
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

    setSegment(json: string): void {
        json = json.slice(1, -1);
        const toSend = 'setSegment ' + json.split('\\"').join('"');
        this.send(toSend);
    }

    setLeds(amount: number): void {
        if (this._previousVisualizerLeds === amount) {
            return;
        }
        this._previousVisualizerLeds = amount;
        this.send(`setLeds ${amount}`);
    }

    setMode(mode: number): void {
        this.send(`setMode ${mode}`);
    }

    setColor(hexStrings: string[]): void {
        const converted: string[] = [];
        for (const hex of hexStrings) {
            converted.push(hex.replace('#', ''));
        }

        this.send(`setColor 0x${converted[0]},0x${converted[1]},0x${converted[2]}`);
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
        this.amountOfLeds = this.settingsService.readGeneralSettings().leds;
    }

    private handleJson(buffer: string): void {
        const json = JSON.parse(buffer);
        if (json.hasOwnProperty('speed')) {
            this.chromaService.speed = json.speed;
        }
    }
}
