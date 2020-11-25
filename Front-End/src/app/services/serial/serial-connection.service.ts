import {ElectronService} from '../electron/electron.service';
import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class SerialConnectionService {
    public port: any;
    public selectedPortId: string;
    public portOpts = {baudRate: 19200, autoOpen: true};
    private receivedMessage: string;
    public readonly amountOfLeds = 30;

    constructor(public electronService: ElectronService) {
        this.selectedPortId = 'COM3';
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
        console.log(this.selectedPortId)
        if (this.port === undefined) {
            console.log(this.selectedPortId)
            this.port = new this.electronService.serialPort(
                this.selectedPortId,
                this.portOpts,
                err => {
                    if (err) {
                        return console.log('[ERR] Error opening port: ' + err.message);
                    }
                }
            );
        }

        this.port.on('open', () => {
            console.log('[LOG] Port opened: ', this.selectedPortId)
        });

        this.port.on('error', err => {
            if (err) {
                console.log('[ERR] Error: ', err.message)
            }

            console.log('Connection closed')
        });

        if (!this.port.isOpen) {
            this.port.open(err => {
                if (err) {
                    console.log('[ERR] Error opening port: ', this.selectedPortId)
                }
            });
        }
        let buffer = '';
        this.port.on('data', function (data) {
            buffer += data.toString();
            const self = this;
            console.log(data.toString())
            if (buffer.indexOf('}') !== -1) {
                try {
                    self.receivedMessage = JSON.parse(buffer);
                    console.log(buffer)
                } catch (e) {
                    console.log('Kan JSON niet inlezen\n' + e)
                }
                buffer = '';
            }
        })
    }

    closePort() {
        this.port.close(err => {
            if (err) {
                console.log('[ERR] Error: ', err.message);
            }
        });
        console.log('[LOG] Port closed: ', this.selectedPortId)
        this.selectedPortId = null;
        this.port = null;
        this.scan();
    }

    send(command: string) {
        this.port.write(command + '\n', function (err) {
            if (err) {
                console.error(err);
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
        this.selectedPortId = localStorage.getItem('com') != null ? localStorage.getItem('com') : 'COM3';
        this.closePort();
        this.openPort();
    }
}
