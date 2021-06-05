import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {HomePageComponent} from './homePage/home-page.component'
import {SettingsPageComponent} from './settingsPage/settings-page.component'
import {VisualizerPageComponent} from './visualizerPage/visualizer-page.component'
import {ModePageComponent} from './modePage/mode-page.component'
import {FormsModule} from '@angular/forms'
import {NouisliderModule} from 'ng2-nouislider'
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {SharedModule} from '../shared/shared.module'


@NgModule({
  declarations: [HomePageComponent, SettingsPageComponent, VisualizerPageComponent, ModePageComponent],
  imports: [
    FormsModule,
    NouisliderModule,
    FontAwesomeModule,
    NgbModule,
    CommonModule,
    SharedModule
  ],
   exports: []
})
export class PagesModule {
}
