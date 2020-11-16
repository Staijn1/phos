import {Injectable} from '@angular/core';
import {ElectronService} from '../electron/electron.service';


@Injectable({
    providedIn: 'root'
})
export class SerialConnectionService {
    public port: any;
    public selectedPortId: string;
    public portOpts = {baudRate: 19200, autoOpen: true};
    private receivedMessage: string;

    constructor(public electronService: ElectronService) {
        this.selectedPortId = 'COM3';
    }

    scan() {
        this.selectedPortId = '';
        let index = 1;
        let portDetails: any;
        this.electronService.serialPort.list().then(ports => {
            console.log('[LOG] List of ports: ', ports)
            ports.forEach(port => {
                portDetails = {
                    id: index,
                    comName: port.comName,
                    manufacturer: port.manufacturer,
                    vendorId: port.vendorId,
                    productId: port.productId,
                };
                console.log('List in table');
                index++;
            });
        });
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
}
