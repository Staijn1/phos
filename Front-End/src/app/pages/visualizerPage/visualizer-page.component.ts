import {Component, OnDestroy, OnInit} from '@angular/core'
import AudioMotionAnalyzer, {Options} from 'audiomotion-analyzer'
import {ColorService} from '../../services/color/color.service'
import {faExpand} from '@fortawesome/free-solid-svg-icons/faExpand'
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave'
import {faFileDownload} from '@fortawesome/free-solid-svg-icons/faFileDownload'
import {faEdit, faLightbulb, faTrash} from '@fortawesome/free-solid-svg-icons'
import {ChromaEffectService} from '../../services/chromaEffect/chroma-effect.service'
import {VisualizerState} from '../../services/chromaEffect/state/visualizer-state/visualizer-state'
import {SettingsService} from '../../services/settings/settings.service'
import {ConnectionService} from '../../services/connection/connection.service'
import {TimelineMax} from 'gsap'
import {GradientInformationExtended} from '../../shared/types/GradientInformation'

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer-page.component.html',
  styleUrls: ['./visualizer-page.component.scss']
})
export class VisualizerPageComponent implements OnInit, OnDestroy {
  visualizerOptions: Options = {};

  // Gradient definitions
  gradients: GradientInformationExtended[] = [];
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
  ];

  smoothingConfig = {
    connect: 'lower',
    start: 0.5, // this.visualizerOptions.smoothing,
    step: 0.1,
    range: {
      min: 0,
      max: 0.9
    },
  };
  frequencyLimits = [this.visualizerOptions.minFreq, this.visualizerOptions.maxFreq];
  frequencyLimitsConfig = {
    behaviour: 'drag',
    connect: true,
    start: [20, 22000], // [this.visualizerOptions.minFreq, this.visualizerOptions.maxFreq],
    range: {
      min: 20,
      max: 22000
    },
    step: 10,
  };
  spinSpeedConfig = {
    connect: 'lower',
    start: 25, // this.visualizerOptions.spinSpeed,
    step: 1,
    range: {
      min: 0,
      max: 50
    },
  };
  fullscreenIcon = faExpand;
  lineWidthConfig = {
    connect: 'lower',
    start: 2, // this.visualizerOptions.lineWidth,
    step: 1,
    range: {
      min: 1,
      max: 5
    },
  };
  bgAlphaConfig = {
    connect: 'lower',
    start: 0.5, // this.visualizerOptions.fillAlpha,
    step: 0.1,
    range: {
      min: 0,
      max: 1
    },
  };
  saveIcon = faSave;
  load = faFileDownload;
  modeIcon = faLightbulb;
  deleteIcon = faTrash;
  editIcon = faEdit;
  private timeline: TimelineMax;
  private defaultSliderOptions = {
    animate: true,
    start: 0,
    range: {min: 0, max: 1},
    connect: [true, false]
  };

  constructor(
    private connection: ConnectionService,
    private colorService: ColorService,
    private settingsService: SettingsService,
    private chromaEffect: ChromaEffectService
  ) {
    this.timeline = new TimelineMax()
    this.init()
  }

  ngOnDestroy(): void {
    this.gradients = undefined
  }

  ngOnInit(): void {
    if (localStorage.getItem('dismissedSettingsPopup') !== 'true') {
      this.timeline.to('#overlay', {duration: 1, opacity: 1}, '+=1.8')
    } else {
      this.dismissOverlay()
    }
  }

  updateLedstrip(): void {
    this.connection.setMode(55)
    this.connection.setColor(this.colorService.getColors)
  }

  drawCallback(instance: AudioMotionAnalyzer): void {
    const value = instance.getEnergy('bass')
    this.connection.setLeds(value)
    this.chromaEffect.intensity = value
  }

  changeGradient(gradientIndex: number): void {
    this.visualizerOptions.gradient = this.gradients[gradientIndex].name
    this.updateOptions()
  }

  changeReflex(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    switch (+value) {
      case 1:
        this.visualizerOptions.reflexRatio = .4
        this.visualizerOptions.reflexAlpha = .2
        break
      case 2:
        this.visualizerOptions.reflexRatio = .5
        this.visualizerOptions.reflexAlpha = 1
        break
      default:
        this.visualizerOptions.reflexRatio = 0
    }
    this.updateOptions()
  }

  fullscreen(): void {
    // this.audioMotion.toggleFullscreen();
  }

  changeShowScale(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.visualizerOptions.showScaleX = !!(+value & 1)
    this.visualizerOptions.showScaleY = !!(+value & 2)
    this.updateOptions()
  }

  changeFrequencyLimit(): void {
    this.visualizerOptions.minFreq = this.frequencyLimits[0]
    this.visualizerOptions.maxFreq = this.frequencyLimits[1]
    this.updateOptions()
  }

  changeDisplay($event: Event): void {
    const element = $event.currentTarget as HTMLElement

    this.visualizerOptions.showLeds = false
    this.visualizerOptions.lumiBars = false
    this.visualizerOptions.radial = false

    if (element.id === 'leds') {
      this.visualizerOptions.showLeds = true
    } else if (element.id === 'lumi') {
      this.visualizerOptions.lumiBars = true
    } else if (element.id === 'radial') {
      this.visualizerOptions.radial = true
    } else if (element.id === 'normal') {
    } else {
      throw Error(`Unknown ID: ${element.id}`)
    }
    this.updateOptions()
  }

  changeGeneralSettings($event: Event): void {
    const element = $event.target as HTMLInputElement

    const value = element.checked

    if (element.id === 'peaks') {
      this.visualizerOptions.showPeaks = value
    } else if (element.id === 'lores') {
      this.visualizerOptions.loRes = value
    } else if (element.id === 'fps') {
      this.visualizerOptions.showFPS = value
    } else {
      throw Error('Unknown ID!')
    }
    this.updateOptions()
  }

  updateMode(event: Event): void {
    let value = +(event.target as HTMLInputElement).value
    switch (+value) {
      case 10:
        this.visualizerOptions.lineWidth = 0
        this.visualizerOptions.fillAlpha = 1
        break
      case 11:
        this.visualizerOptions.lineWidth = 5
        this.visualizerOptions.fillAlpha = 0.1
        value = 10
        break
    }

    this.visualizerOptions.mode = value
    this.updateOptions()
  }

  loadOptions(): void {
    this.visualizerOptions = {
      ...this.settingsService.readVisualizerOptions(),
      ...{
        onCanvasDraw: this.drawCallback.bind(this)
      }
    }
  }

  saveOptions(): void {
    this.settingsService.saveVisualizerOptions(this.visualizerOptions)
  }

  private async getGradients(): Promise<void> {
    const gradients = await this.connection.getGradients() as GradientInformationExtended[]
    for (const gradient of gradients) {
      gradient.collapsed = true
      gradient.sliderOptions = this.defaultSliderOptions
    }

    this.gradients = gradients
  }

  private init(): void {
    this.getGradients().then(() => {
      this.loadOptions()
    })
    this.chromaEffect.state = new VisualizerState()

    setTimeout(() => {
      this.updateLedstrip()
    }, 2000)
  }

  scroll(el: HTMLDivElement): void {
    el.scrollIntoView({behavior: 'smooth'})
  }

  dismissOverlay(): void {
    this.timeline.to('#overlay', {duration: 1, opacity: 0})
    this.timeline.to('#overlay', {duration: 0.5, visibility: 'hidden'})
    localStorage.setItem('dismissedSettingsPopup', 'true')
  }

  submitGradient(gradient: GradientInformationExtended): void {
    this.visualizerOptions.gradient = gradient.name
  }

  updateOptions(): void {
    this.visualizerOptions = Object.assign({}, this.visualizerOptions)
  }
}
