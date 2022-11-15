import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {RouterModule} from '@angular/router'
import {VisualizerComponent} from './components/visualizer/visualizer.component'
import {CastPipe} from "./pipe/CastPipe";
import {ModalComponent} from "./components/modal/modal.component";


@NgModule({
  declarations: [VisualizerComponent, CastPipe, ModalComponent],
  imports: [
    RouterModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [RouterModule, VisualizerComponent, CastPipe, ModalComponent]
})
export class SharedModule {
}
