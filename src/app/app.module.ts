
import {AppComponent} from './app.component';

import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing/app-routing.module';

import {ElectronService} from './services/electron/electron.service';
import {SerialportronComponent} from './components/serialportron/serialportron.component';
import {SegmentsComponent} from './components/segments/segments.component';
import {FormsModule} from '@angular/forms';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NouisliderModule} from 'ng2-nouislider';

@NgModule({
    imports: [BrowserModule, CommonModule, AppRoutingModule, FormsModule, NouisliderModule],
    declarations: [
        AppComponent,
        SerialportronComponent,
        SegmentsComponent],
    bootstrap: [AppComponent],
    providers: [ElectronService],
})
export class AppModule {
    constructor() {
        // const colorpicker = iro.ColorPicker('#picker', {
        //     width: 200,
        //     layoutDirection: 'horizontal',
        //     handleRadius: 6,
        //     borderWidth: 2,
        //     borderColor: '#fff',
        //     wheelAngle: 90,
        //     colors: [
        //         'rgb(100%, 0, 0)', // pure red
        //         'rgb(0, 100%, 0)', // pure green
        //         'rgb(0, 0, 100%)', // pure blue
        //     ],
        // });
    }
}
