import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing/app-routing.module';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {VisualizerComponent} from './pages/visualizer/visualizer.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {ModeComponent} from './pages/mode/mode.component';
import {NavigationbarComponent} from './shared/components/navigationbar/navigationbar.component';
import {ElectronService} from './services/electron/electron.service';
import {HomeComponent} from './pages/home/home.component';
import {NouisliderModule} from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from './shared/shared.module';
@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule, AppRoutingModule, NouisliderModule, FontAwesomeModule, NgbModule, SharedModule],
    declarations: [
        AppComponent,
        VisualizerComponent,
        SettingsComponent,
        ModeComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent],
    providers: [ElectronService],
})
export class AppModule {
}
