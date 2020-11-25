import {NgModule} from '@angular/core';
import {NouisliderModule} from 'ng2-nouislider';
import {AppRoutingModule} from './app-routing/app-routing.module';

import {AppComponent} from './app.component';
import {SerialportronComponent} from './components/serialportron/serialportron.component';
import {SegmentsComponent} from './components/segments/segments.component';
import {VisualizerComponent} from './components/visualizer/visualizer.component';
import {SettingsComponent} from './components/settings/settings.component';
import {ModeComponent} from './components/mode/mode.component';
import {NavigationbarComponent} from './components/navigationbar/navigationbar.component';

import {ElectronService} from './services/electron/electron.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {VisualizerTestComponent} from './components/visualizer-test/visualizer-test.component';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


@NgModule({
    imports: [BrowserModule, CommonModule, FormsModule, AppRoutingModule, NouisliderModule, FontAwesomeModule],
    declarations: [
        AppComponent,
        SerialportronComponent,
        SegmentsComponent,
        VisualizerComponent,
        SettingsComponent,
        ModeComponent,
        NavigationbarComponent,
        VisualizerTestComponent
    ],
    bootstrap: [AppComponent],
    providers: [ElectronService],
})
export class AppModule {
    constructor() {}
}
