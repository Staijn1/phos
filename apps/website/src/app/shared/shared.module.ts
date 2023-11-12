import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { CastPipe } from './pipe/cast/CastPipe';
import { OffCanvasComponent } from './components/offcanvas/off-canvas.component';
import { ColorpickerComponent } from './components/colorpicker/colorpicker.component';
import { SpotifyPlayerComponent } from './components/spotify-player/spotify-player.component';
import { FormsModule } from '@angular/forms';
import { MsToTimePipe } from './pipe/ms-to-time/MsToTime';
import { YesNoPipe } from './pipe/yes-no/yes-no.pipe';
import { MappedIPv6ToIPv4Pipe } from './pipe/mapped-ipv6-to-ipv4/mapped-ipv6-to-ipv4.pipe';
import { DeviceComponent } from './components/device/device.component';

@NgModule({
  declarations: [
    ColorpickerComponent,
    VisualizerComponent,
    CastPipe,
    OffCanvasComponent,
    SpotifyPlayerComponent,
    MsToTimePipe,
    YesNoPipe,
    MappedIPv6ToIPv4Pipe,
    DeviceComponent,
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
    YesNoPipe,
    MappedIPv6ToIPv4Pipe,
    DeviceComponent,
  ],
})
export class SharedModule {}
