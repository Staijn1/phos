import {NgModule} from '@angular/core'
import {AppRoutingModule} from './app-routing/app-routing.module'
import {AppComponent} from './main/app/app.component'
import {CommonModule} from '@angular/common'
import {BrowserModule} from '@angular/platform-browser'
import {SharedModule} from './shared/shared.module'
import {PagesModule} from './pages/pages.module'
import {NavigationbarComponent} from "./main/navigationbar/navigationbar.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ColorpickerComponent} from "./main/colorpicker/colorpicker.component";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PagesModule,
    FontAwesomeModule
  ],
  declarations: [
    AppComponent,
    NavigationbarComponent,
    ColorpickerComponent
  ],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {
}
