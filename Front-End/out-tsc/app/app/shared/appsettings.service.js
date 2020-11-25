"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSettingsService = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var appsettings_1 = require("./appsettings");
var AppSettingsService = /** @class */ (function () {
    function AppSettingsService() {
    }
    AppSettingsService.prototype.getSettings = function () {
        var settings = new appsettings_1.AppSettings();
        return Observable_1.Observable.of(settings);
    };
    AppSettingsService = __decorate([
        core_1.Injectable()
    ], AppSettingsService);
    return AppSettingsService;
}());
exports.AppSettingsService = AppSettingsService;
//# sourceMappingURL=appsettings.service.js.map