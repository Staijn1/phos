import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { VisualizerPageComponent } from './visualizer-page/visualizer-page.component';
import { ModePageComponent } from './mode-page/mode-page.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { NgxSliderModule } from 'ngx-slider-v2';
import { ShortcutPageComponent } from './shortcut-page/shortcut-page.component';
import { ThemeVisualizationComponent } from "../shared/components/theme-visualization/theme-visualization.component";

@NgModule({
  declarations: [
    SettingsPageComponent,
    VisualizerPageComponent,
    ModePageComponent,
    ShortcutPageComponent
  ],
  imports: [
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    SharedModule,
    NgxSliderModule,
    ThemeVisualizationComponent
  ],
  exports: []
})
export class PagesModule {
}
