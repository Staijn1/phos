var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
var SerialportronComponent = /** @class */ (function () {
    function SerialportronComponent(electronService) {
        this.electronService = electronService;
        this.portOpts = { baudRate: 115200, autoOpen: false };
    }
    SerialportronComponent.prototype.ngOnInit = function () {
        this.tableData = {
            headerRow: ['#', 'COM name', 'Manuf.', 'Vendor ID', 'Product ID'],
            dataRows: [],
        };
    };
    SerialportronComponent.prototype.scan = function () {
        var _this = this;
        this.selectedPortId = '';
        var index = 1;
        var portDetails;
        this.tableData.dataRows = []; // clear
        this.electronService.serialPort.list().then(function (ports) {
            console.log('[LOG] List of ports: ', ports);
            ports.forEach(function (port) {
                portDetails = {
                    id: index,
                    comName: port.comName,
                    manufacturer: port.manufacturer,
                    vendorId: port.vendorId,
                    productId: port.productId,
                };
                _this.tableData.dataRows.push(portDetails);
                index++;
            });
        });
    };
    SerialportronComponent.prototype.getPort = function ($event) {
        var _this = this;
        console.log('[LOG] Selected port ID: ', $event.target.textContent);
        this.selectedPortId = $event.target.textContent;
        this.tableData.dataRows = this.tableData.dataRows.filter(function (element) { return element.comName === _this.selectedPortId; });
    };
    SerialportronComponent.prototype.openPort = function () {
        var _this = this;
        this.port = new this.electronService.serialPort(this.selectedPortId, this.portOpts, function (err) {
            if (err) {
                return console.log('[ERR] Error opening port: ', err.message);
            }
        });
        this.port.on('open', function () {
            console.log('[LOG] Port opened: ', _this.selectedPortId);
        });
        this.port.on('error', function (err) {
            if (err) {
                console.log('[ERR] Error: ', err.message);
            }
        });
        this.port.open(function (err) {
            if (err) {
                console.log('[ERR] Error opening port: ', _this.selectedPortId);
            }
        });
    };
    SerialportronComponent.prototype.closePort = function () {
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
    SerialportronComponent = __decorate([
        Component({
            selector: 'app-serialportron',
            templateUrl: 'serialportron.component.html',
        }),
        __metadata("design:paramtypes", [ElectronService])
    ], SerialportronComponent);
    return SerialportronComponent;
}());
export { SerialportronComponent };
//# sourceMappingURL=serialportron.component.js.map