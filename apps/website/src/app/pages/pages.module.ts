import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {SettingsPageComponent} from './settingsPage/settings-page.component'
import {VisualizerPageComponent} from './visualizerPage/visualizer-page.component'
import {ModePageComponent} from './modePage/mode-page.component'
import {FormsModule} from '@angular/forms'
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {SharedModule} from '../shared/shared.module'
import {VisualizerPage3DComponent} from './visualizer-page3-d/visualizer-page3-d.component'
import {NgxSliderModule} from "@angular-slider/ngx-slider";


@NgModule({
  declarations: [
    SettingsPageComponent,
    VisualizerPageComponent,
    ModePageComponent,
    VisualizerPage3DComponent
  ],
  imports: [
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    CommonModule,
    SharedModule,
    NgxSliderModule,
  ],
  exports: []
})
export class PagesModule {
}
