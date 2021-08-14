import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core'
import {SphereScene} from './scenes/SphereScene'
import {BaseScene} from './scenes/BaseScene'
import {ConnectionService} from '../../services/connection/connection.service'
import {SettingsService} from '../../services/settings/settings.service'

@Component({
  selector: 'app-visualizer-page3-d',
  templateUrl: './visualizer-page3-d.component.html',
  styleUrls: ['./visualizer-page3-d.component.scss']
})
export class VisualizerPage3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeContainer') threeContainer: ElementRef;
  private scene: BaseScene;

  constructor(private readonly connection: ConnectionService, private readonly settingsService: SettingsService) {
  }

  ngAfterViewInit(): void {
    this.scene = new SphereScene(this.threeContainer, this.connection, this.settingsService)
    this.connection.setMode(56)
  }

  ngOnDestroy(): void {
    this.scene.uninit()
    this.scene = undefined
  }
}

