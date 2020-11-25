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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorService = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var iro_1 = require("@jaames/iro");
var serial_connection_service_1 = require("../serial/serial-connection.service");
var ColorService = /** @class */ (function () {
    function ColorService(document, serialService) {
        var _this = this;
        this.document = document;
        this.serialService = serialService;
        setTimeout(function () {
            _this.picker = iro_1.default.ColorPicker('#picker', {
                width: 200,
                layoutDirection: 'horizontal',
                handleRadius: 6,
                borderWidth: 2,
                borderColor: '#fff',
                wheelAngle: 90,
                colors: [
                    'rgb(100%, 0, 0)',
                    'rgb(0, 100%, 0)',
                    'rgb(0, 0, 100%)',
                ],
            });
            _this.picker.on('color:change', function (color) {
                _this.serialService.setColor(color.hexString);
            });
        }, 1);
    }
    Object.defineProperty(ColorService.prototype, "getFirstColorString", {
        get: function () {
            return this.picker.colors[0].hexString;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorService.prototype, "getSecondColorString", {
        get: function () {
            return this.picker.colors[1].hexString;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorService.prototype, "getThirdColorString", {
        get: function () {
            return this.picker.colors[2].hexString;
        },
        enumerable: false,
        configurable: true
    });
    ColorService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __param(0, core_1.Inject(common_1.DOCUMENT)),
        __metadata("design:paramtypes", [HTMLDocument, serial_connection_service_1.SerialConnectionService])
    ], ColorService);
    return ColorService;
}());
exports.ColorService = ColorService;
//# sourceMappingURL=color.service.js.map