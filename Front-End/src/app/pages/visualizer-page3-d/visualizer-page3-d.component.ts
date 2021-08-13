import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core'
import {SphereScene} from './scenes/SphereScene'

@Component({
  selector: 'app-visualizer-page3-d',
  templateUrl: './visualizer-page3-d.component.html',
  styleUrls: ['./visualizer-page3-d.component.scss']
})
export class VisualizerPage3DComponent implements AfterViewInit {
  @ViewChild('threeContainer') threeContainer: ElementRef;

  ngAfterViewInit(): void {
    const sphereScene = new SphereScene(this.threeContainer)
  }
}

