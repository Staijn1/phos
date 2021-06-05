import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing/app-routing.module';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ElectronService} from './services/electron/electron.service';
import {SharedModule} from './shared/shared.module';
import {PagesModule} from './pages/pages.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PagesModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
  providers: [ElectronService],
})
export class AppModule {
}
