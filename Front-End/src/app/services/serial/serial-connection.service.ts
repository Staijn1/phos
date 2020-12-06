import {ElectronService} from '../electron/electron.service';
import {Injectable} from '@angular/core';
import {FileService} from '../file/file.service';


@Injectable({
    providedIn: 'root'
})
export class SerialConnectionService {
    public port: any;
    public selectedPortId: string;
    public portOpts = {baudRate: 19200, autoOpen: true};
    public amountOfLeds = 30;
    serialConnectionError: string;

    constructor(public electronService: ElectronService, private fileService: FileService) {
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
                this.setColor(this.fileService.readGeneralSettings().colors[0]);
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
            console.log(data.toString());
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
        this.send(`setLeds ${amount}`);
    }

    setMode(mode: number): void {
        this.send(`setMode ${mode}`);
    }

    setColor(hexString: string): void {
        hexString = hexString.replace('#', '');
        this.send(`setColor 0x${hexString}`);
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
        // @ts-ignore
        this.selectedPortId = this.fileService.readGeneralSettings().com;
        // @ts-ignore
        this.amountOfLeds = this.fileService.readGeneralSettings().leds;
    }
}
