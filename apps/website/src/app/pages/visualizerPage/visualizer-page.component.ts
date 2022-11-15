import {Component, OnDestroy, ViewChild} from '@angular/core'
import AudioMotionAnalyzer, {Options} from 'audiomotion-analyzer'
import {faExpand} from '@fortawesome/free-solid-svg-icons/faExpand'
import {faLightbulb, faWrench} from '@fortawesome/free-solid-svg-icons'
import {ChromaEffectService} from '../../services/chromaEffect/chroma-effect.service'
import {SettingsService} from '../../services/settings/settings.service'
import {ConnectionService} from '../../services/connection/connection.service'
import {TimelineMax} from 'gsap'
import {VisualizerComponent} from '../../shared/components/visualizer/visualizer.component'
import {GradientInformation} from "@angulon/interfaces";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {OffCanvasComponent} from "../../shared/components/offcanvas/off-canvas.component";

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer-page.component.html',
  styleUrls: ['./visualizer-page.component.scss'],
})
export class VisualizerPageComponent implements OnDestroy {
  @ViewChild(VisualizerComponent) visualizerComponent!: VisualizerComponent
  @ViewChild(OffCanvasComponent) offcanvas!: OffCanvasComponent;
  visualizerOptions: Options = {}

  // Gradient definitions
  gradients: GradientInformation[] = []
  // Visualization modes
  modes = [
    {value: 0, text: 'Discrete frequencies', disabled: false},
    {value: 10, text: 'Area graph', disabled: false},
    {value: 11, text: 'Line graph', disabled: false},
    {value: 1, text: '1/24th octave bands', disabled: false},
    {value: 2, text: '1/12th octave bands', disabled: false},
    {value: 3, text: '1/8th octave bands', disabled: false},
    {value: 4, text: '1/6th octave bands', disabled: false},
    {value: 5, text: '1/4th octave bands', disabled: false},
    {value: 6, text: '1/3rd octave bands', disabled: false},
    {value: 7, text: 'Half octave bands', disabled: false},
    {value: 8, text: 'Full octave bands', disabled: false},
  ]
  settingsIcon = faWrench;
  fullscreenIcon = faExpand
  modeIcon = faLightbulb
  private timeline: TimelineMax

  constructor(
    private connection: ConnectionService,
    private settingsService: SettingsService,
    private chromaEffect: ChromaEffectService,
  ) {
    this.timeline = new TimelineMax()
  }

  ngOnDestroy(): void {
    this.gradients = []
  }

  updateLedstrip(): void {
    this.connection.setMode(56)
  }

  drawCallback(instance: AudioMotionAnalyzer): void {
    const value = instance.getEnergy('bass')
    this.connection.setLeds(value)
    this.chromaEffect.intensity = value
  }

  fullscreen(): void {
    this.visualizerComponent.toggleFullscreen()
  }

  init(): void {
    this.connection.getGradients().then((gradients) => {
      this.gradients = gradients
      // this.chromaEffect.state = new VisualizerBrightnessState()
    });
  }

  readSettings() {
    const settings = this.settingsService.readVisualizerOptions();
    settings.onCanvasDraw = this.drawCallback.bind(this)
    this.visualizerOptions = settings
  }

  updateOptions(): void {
    this.visualizerOptions = Object.assign({}, this.visualizerOptions)
  }

  openSettingsWindow() {
    this.offcanvas.open({
      position: 'end',
      backdropClass: 'offcanvas-backdrop-custom',
    })
  }

  applySettings() {
    this.visualizerOptions = Object.assign({}, this.visualizerOptions)
    this.settingsService.saveVisualizerOptions(this.visualizerOptions)
  }
}
