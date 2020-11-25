"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialConnectionService = void 0;
var electron_service_1 = require("../electron/electron.service");
var core_1 = require("@angular/core");
var SerialConnectionService = /** @class */ (function () {
    function SerialConnectionService(electronService) {
        this.electronService = electronService;
        this.portOpts = { baudRate: 19200, autoOpen: true };
        this.amountOfLeds = 30;
        this.selectedPortId = 'COM3';
        this.openPort();
    }
    SerialConnectionService.prototype.scan = function () {
        this.selectedPortId = '';
        return this.electronService.serialPort.list();
    };
    SerialConnectionService.prototype.getPort = function ($event) {
        console.log('[LOG] Selected port ID: ', $event.target.textContent);
        this.selectedPortId = $event.target.textContent;
    };
    SerialConnectionService.prototype.openPort = function () {
        var _this = this;
        console.log(this.selectedPortId);
        if (this.port === undefined) {
            console.log(this.selectedPortId);
            this.port = new this.electronService.serialPort(this.selectedPortId, this.portOpts, function (err) {
                if (err) {
                    return console.log('[ERR] Error opening port: ' + err.message);
                }
            });
        }
        this.port.on('open', function () {
            console.log('[LOG] Port opened: ', _this.selectedPortId);
        });
        this.port.on('error', function (err) {
            if (err) {
                console.log('[ERR] Error: ', err.message);
            }
            console.log('Connection closed');
        });
        if (!this.port.isOpen) {
            this.port.open(function (err) {
                if (err) {
                    console.log('[ERR] Error opening port: ', _this.selectedPortId);
                }
            });
        }
        var buffer = '';
        this.port.on('data', function (data) {
            buffer += data.toString();
            var self = this;
            console.log(data.toString());
            if (buffer.indexOf('}') !== -1) {
                try {
                    self.receivedMessage = JSON.parse(buffer);
                    console.log(buffer);
                }
                catch (e) {
                    console.log('Kan JSON niet inlezen\n' + e);
                }
                buffer = '';
            }
        });
    };
    SerialConnectionService.prototype.closePort = function () {
        this.port.close(function (err) {
            if (err) {
                console.log('[ERR] Error: ', err.message);
            }
        });
        console.log('[LOG] Port closed: ', this.selectedPortId);
        this.selectedPortId = null;
        this.port = null;
        this.scan();
    };
    SerialConnectionService.prototype.send = function (command) {
        this.port.write(command + '\n', function (err) {
            if (err) {
                console.error(err);
            }
        });
    };
    SerialConnectionService.prototype.setSegment = function (json) {
        json = json.slice(1, -1);
        var toSend = 'setSegment ' + json.split('\\"').join('"');
        console.log(toSend);
        this.send(toSend);
    };
    SerialConnectionService.prototype.setLeds = function (number) {
        this.send("setLeds " + number);
    };
    SerialConnectionService.prototype.setMode = function (mode) {
        this.send("setMode " + mode);
    };
    SerialConnectionService.prototype.setColor = function (hexString) {
        hexString = hexString.replace('#', '');
        this.send("setColor 0x" + hexString);
    };
    SerialConnectionService.prototype.update = function () {
        this.selectedPortId = localStorage.getItem('com') != null ? localStorage.getItem('com') : 'COM3';
        this.closePort();
        this.openPort();
    };
    SerialConnectionService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [electron_service_1.ElectronService])
    ], SerialConnectionService);
    return SerialConnectionService;
}());
exports.SerialConnectionService = SerialConnectionService;
//# sourceMappingURL=serial-connection.service.js.map