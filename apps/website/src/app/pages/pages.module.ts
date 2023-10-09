import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { NgxSliderModule } from 'ngx-slider-v2';
import { ThemeVisualizationComponent } from "../shared/components/theme-visualization/theme-visualization.component";

@NgModule({
  declarations: [
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
