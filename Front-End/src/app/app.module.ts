import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing/app-routing.module';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {VisualizerComponent} from './components/visualizer/visualizer.component';
import {SettingsComponent} from './components/settings/settings.component';
import {ModeComponent} from './components/mode/mode.component';
import {NavigationbarComponent} from './components/navigationbar/navigationbar.component';
import {ElectronService} from './services/electron/electron.service';
import {HomeComponent} from './components/home/home.component';
import {NouisliderModule} from 'ng2-nouislider';

@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule, AppRoutingModule, NouisliderModule, FontAwesomeModule],
    declarations: [
        AppComponent,
        VisualizerComponent,
        SettingsComponent,
        ModeComponent,
        NavigationbarComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent],
    providers: [ElectronService],
})
export class AppModule {
}
