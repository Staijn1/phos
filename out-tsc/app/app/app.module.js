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
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var ng2_nouislider_1 = require("ng2-nouislider");
var app_routing_module_1 = require("./app-routing/app-routing.module");
var app_component_1 = require("./app.component");
var serialportron_component_1 = require("./components/serialportron/serialportron.component");
var segments_component_1 = require("./components/segments/segments.component");
var visualizer_component_1 = require("./components/visualizer/visualizer.component");
var settings_component_1 = require("./components/settings/settings.component");
var mode_component_1 = require("./components/mode/mode.component");
var navigationbar_component_1 = require("./components/navigationbar/navigationbar.component");
var electron_service_1 = require("./services/electron/electron.service");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var visualizer_test_component_1 = require("./components/visualizer-test/visualizer-test.component");
var platform_browser_1 = require("@angular/platform-browser");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, common_1.CommonModule, forms_1.FormsModule, app_routing_module_1.AppRoutingModule, ng2_nouislider_1.NouisliderModule, angular_fontawesome_1.FontAwesomeModule],
            declarations: [
                app_component_1.AppComponent,
                serialportron_component_1.SerialportronComponent,
                segments_component_1.SegmentsComponent,
                visualizer_component_1.VisualizerComponent,
                settings_component_1.SettingsComponent,
                mode_component_1.ModeComponent,
                navigationbar_component_1.NavigationbarComponent,
                visualizer_test_component_1.VisualizerTestComponent
            ],
            bootstrap: [app_component_1.AppComponent],
            providers: [electron_service_1.ElectronService],
        }),
        __metadata("design:paramtypes", [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map