import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpotifyAuthenticationCallbackComponent} from './spotify-authentication-callback.component';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [SpotifyAuthenticationCallbackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SpotifyAuthenticationCallbackComponent
      }
    ]),
  ],
})
export class SpotifyCallbackPageModule {
}
