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

    getPort($event) {
        console.log('[LOG] Selected port ID: ', $event.target.textContent);
        this.selectedPortId = $event.target.textContent;
    }

    openPort() {
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

        this.port.on('error', err => {
            if (err) {
                this.handleError(err)
            }
        });

        if (!this.port.isOpen) {
            this.port.open(err => {
                if (err) {
                    this.handleError(err)
                }
            });
        }
        let buffer = '';
        this.port.on('data', (data) => {
            buffer += data.toString();
            console.log(data.toString())
        })
    }

    closePort() {
        this.port.close(err => {
            if (err) {
                this.handleError(err)
            }
        });
        this.selectedPortId = null;
    }

    send(command: string) {
        this.port.write(command + '\n', (err) => {
            if (err) {
                this.handleError(err)
            }
        })
    }

    setSegment(json: string) {
        json = json.slice(1, -1)
        const toSend = 'setSegment ' + json.split('\\"').join('"');
        console.log(toSend)
        this.send(toSend)
    }

    setLeds(number: number) {
        this.send(`setLeds ${number}`);
    }

    setMode(mode: number) {
        this.send(`setMode ${mode}`);
    }

    setColor(hexString: string) {
        hexString = hexString.replace('#', '');
        this.send(`setColor 0x${hexString}`)
    }

    update() {
        this.closePort();
        this.readSettings();
        setTimeout(() => {
            this.openPort();
        }, 1000)
    }

    private handleError(err: Error) {
        return console.log('[ERR] Error opening port: ' + err.message);
    }

    private readSettings() {
        // @ts-ignore
        this.selectedPortId = this.fileService.readGeneralSettings().com;
        // @ts-ignore
        this.amountOfLeds = this.fileService.readGeneralSettings().leds;
    }
}
