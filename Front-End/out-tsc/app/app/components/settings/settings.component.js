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
exports.SettingsComponent = void 0;
var core_1 = require("@angular/core");
var appsettings_service_1 = require("../../shared/appsettings.service");
var serial_connection_service_1 = require("../../services/serial/serial-connection.service");
var $ = require("jquery");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(appSettingsService, serialService) {
        this.appSettingsService = appSettingsService;
        this.serialService = serialService;
        this.coms = [];
    }
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.appSettingsService.getSettings().subscribe(function (settings) { return _this.settings = settings; }, function () { return null; }, function () {
            console.log(_this.settings.defaultPrice);
            console.log(_this.settings.defaultUrl);
        });
        var index = 0;
        this.serialService.scan().then(function (ports) {
            ports.forEach(function (port) {
                var details = {
                    id: index,
                    comName: port.comName,
                };
                _this.coms.push(details);
                index++;
            });
            console.log(_this.coms);
        });
    };
    SettingsComponent.prototype.saveSettings = function () {
        var selectedCom = $('#coms').val();
        console.log(selectedCom);
        localStorage.setItem('com', selectedCom);
        console.log(localStorage.getItem('com'));
        // this.serialService.update();
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.component.html',
            styleUrls: ['./settings.component.scss'],
            providers: [appsettings_service_1.AppSettingsService]
        }),
        __metadata("design:paramtypes", [appsettings_service_1.AppSettingsService, serial_connection_service_1.SerialConnectionService])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map