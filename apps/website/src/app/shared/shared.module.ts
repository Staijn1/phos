import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { CastPipe } from './pipe/CastPipe';
import { ModalComponent } from './components/modal/modal.component';
import { OffCanvasComponent } from './components/offcanvas/off-canvas.component';
import { ColorpickerComponent } from './components/colorpicker/colorpicker.component';
import { SpotifyPlayerComponent } from './components/spotify-player/spotify-player.component';

@NgModule({
  declarations: [
    ColorpickerComponent,
    VisualizerComponent,
    CastPipe,
    ModalComponent,
    OffCanvasComponent,
    SpotifyPlayerComponent,
  ],
    imports: [RouterModule, CommonModule, FontAwesomeModule, NgOptimizedImage],
    exports: [
        RouterModule,
        VisualizerComponent,
        CastPipe,
        ModalComponent,
        OffCanvasComponent,
        ColorpickerComponent,
        SpotifyPlayerComponent,
    ],
})
export class SharedModule {}
