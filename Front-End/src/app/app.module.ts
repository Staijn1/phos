import {NgModule} from '@angular/core';
import {NouisliderModule} from 'ng2-nouislider';
import {AppRoutingModule} from './app-routing/app-routing.module';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SegmentsComponent} from './components/segments/segments.component';
import {VisualizerComponent} from './components/visualizer/visualizer.component';
import {SettingsComponent} from './components/settings/settings.component';
import {ModeComponent} from './components/mode/mode.component';
import {NavigationbarComponent} from './components/navigationbar/navigationbar.component';
import {ElectronService} from './services/electron/electron.service';
import {PreloaderComponent} from './components/preloader/preloader.component';
import {HomeComponent} from './components/home/home.component';

@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule, AppRoutingModule, NouisliderModule, FontAwesomeModule],
    declarations: [
        AppComponent,
        SegmentsComponent,
        VisualizerComponent,
        SettingsComponent,
        ModeComponent,
        NavigationbarComponent,
        PreloaderComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent],
    providers: [ElectronService],
})
export class AppModule {
    constructor() {
    }
}
