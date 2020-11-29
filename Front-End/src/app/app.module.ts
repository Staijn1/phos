import {NgModule} from '@angular/core';
import {NouisliderModule} from 'ng2-nouislider';
import {AppRoutingModule} from './app-routing/app-routing.module';

import {AppComponent} from './app.component';
import {SegmentsComponent} from './components/segments/segments.component';
import {SettingsComponent} from './components/settings/settings.component';
import {ModeComponent} from './components/mode/mode.component';


import {ElectronService} from './services/electron/electron.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {VisualizerComponent} from './components/visualizer-test/visualizer.component';

import {FormsModule} from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import {NavigationbarComponent} from './components/navigationbar/navigationbar.component';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';


@NgModule({
    imports: [BrowserModule, CommonModule, FormsModule, AppRoutingModule, NouisliderModule, FontAwesomeModule],
    declarations: [
        AppComponent,
        NavigationbarComponent,
        SegmentsComponent,
        SettingsComponent,
        ModeComponent,
        VisualizerComponent,
        HomeComponent,
        PreloaderComponent
    ],
    bootstrap: [AppComponent],
    providers: [ElectronService],
})
export class AppModule {
    constructor() {}
}
