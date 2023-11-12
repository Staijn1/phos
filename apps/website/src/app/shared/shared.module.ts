import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { CastPipe } from './pipe/CastPipe';
import { OffCanvasComponent } from './components/offcanvas/off-canvas.component';
import { ColorpickerComponent } from './components/colorpicker/colorpicker.component';
import { SpotifyPlayerComponent } from './components/spotify-player/spotify-player.component';
import { FormsModule } from '@angular/forms';
import { MsToTimePipe } from './pipe/MsToTime';
import { YesNoPipe } from './pipe/yes-no.pipe';

@NgModule({
  declarations: [
    ColorpickerComponent,
    VisualizerComponent,
    CastPipe,
    OffCanvasComponent,
    SpotifyPlayerComponent,
    MsToTimePipe,
    YesNoPipe,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FontAwesomeModule,
    NgOptimizedImage,
    FormsModule,
  ],
  exports: [
    RouterModule,
    VisualizerComponent,
    CastPipe,
    OffCanvasComponent,
    ColorpickerComponent,
    SpotifyPlayerComponent,
  ],
})
export class SharedModule {}
