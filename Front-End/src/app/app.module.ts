import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing/app-routing.module'

import { AppComponent } from './app.component'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { ElectronService } from './services/electron/electron.service'
import { SharedModule } from './shared/shared.module'
import { PagesModule } from './pages/pages.module'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PagesModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately'
    }),
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
  providers: [ElectronService],
})
export class AppModule {
}
