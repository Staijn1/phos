import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core'
import {SphereScene} from './scenes/SphereScene'
import {BaseScene} from './scenes/BaseScene'
import {LedstripCommandService} from '../../services/ledstrip-command/ledstrip-command.service'
import {SettingsService} from '../../services/settings/settings.service'
import {SphereLightScene} from './scenes/SphereLightScene'

@Component({
  selector: 'app-visualizer-page3-d',
  templateUrl: './visualizer-page3-d.component.html',
  styleUrls: ['./visualizer-page3-d.component.scss']
})
export class VisualizerPage3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeContainer') threeContainer!: ElementRef;
  private scene: BaseScene | undefined;
  scenes: { name: string, action: BaseScene }[] = []
  selectedScene = 0;

  constructor(private readonly connection: LedstripCommandService, private readonly settingsService: SettingsService) {
  }

  ngAfterViewInit(): void {
    this.selectedScene = 0
    this.scenes = [
      {name: 'Sphere Scene', action: new SphereScene(this.threeContainer, this.connection, this.settingsService)},
      {
        name: 'Sphere Light Scene',
        action: new SphereLightScene(this.threeContainer, this.connection, this.settingsService)
      }
    ]
    this.scene = this.scenes[this.selectedScene].action
    this.scene.init()
    this.connection.setMode(56)
  }

  ngOnDestroy(): void {
    this.scene?.uninit()
    this.scene = undefined
  }

  changeScene(newSceneIndex: number) {
    this.currentScene.action.uninit()
    this.selectedScene = newSceneIndex
    this.currentScene.action.init()
  }

  private get currentScene() {
    return this.scenes[this.selectedScene]
  }
}

