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
exports.SerialportronComponent = void 0;
var core_1 = require("@angular/core");
var serial_connection_service_1 = require("../../services/serial/serial-connection.service");
var SerialportronComponent = /** @class */ (function () {
    function SerialportronComponent(serialService) {
        this.serialService = serialService;
        this.portOpts = { baudRate: 115200, autoOpen: false };
    }
    SerialportronComponent.prototype.ngOnInit = function () {
        this.tableData = {
            headerRow: ['#', 'COM name', 'Manuf.', 'Vendor ID', 'Product ID'],
            dataRows: [],
        };
    };
    SerialportronComponent.prototype.scan = function () {
        this.serialService.scan();
    };
    SerialportronComponent.prototype.getPort = function ($event) {
        this.serialService.getPort($event);
    };
    SerialportronComponent.prototype.openPort = function () {
        this.serialService.openPort();
    };
    SerialportronComponent.prototype.closePort = function () {
        this.serialService.closePort();
    };
    SerialportronComponent = __decorate([
        core_1.Component({
            selector: 'app-serialportron',
            templateUrl: 'serialportron.component.html',
        }),
        __metadata("design:paramtypes", [serial_connection_service_1.SerialConnectionService])
    ], SerialportronComponent);
    return SerialportronComponent;
}());
exports.SerialportronComponent = SerialportronComponent;
//# sourceMappingURL=serialportron.component.js.map