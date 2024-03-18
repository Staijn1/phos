import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {AppComponent} from './main/app/app.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from './shared/shared.module';
import {NavigationbarComponent} from './main/navigationbar/navigationbar.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {roomStateReducer} from '../redux/roomstate/roomstate.reducer';
import {modesReducer} from '../redux/modes/modes.reducer';
import {gradientsReducer} from '../redux/gradients/gradients.reducer';
import {userPreferencesReducer} from '../redux/user-preferences/user-preferences.reducer';
import {networkStateReducer} from '../redux/networkstate/networkstate.reducer';
import {BaseChromaConnection} from './services/chroma-sdk/base-chroma-connection.service';
import {WebsocketChromaConnectionService} from './services/chroma-sdk/websocket-chroma-connection.service';
import {RoomSelectComponent} from './shared/components/room-select/room-select.component';

const StoreDevtools = StoreDevtoolsModule.instrument();
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    StoreModule.forRoot({
      roomState: roomStateReducer,
      modes: modesReducer,
      gradients: gradientsReducer,
      userPreferences: userPreferencesReducer,
      networkState: networkStateReducer
    }),
    StoreDevtools,
    FontAwesomeModule,
    RoomSelectComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately'
    })
  ],
  declarations: [
    AppComponent,
    NavigationbarComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: BaseChromaConnection,
      useClass: WebsocketChromaConnectionService
    }
  ]
})
export class AppModule {
}
