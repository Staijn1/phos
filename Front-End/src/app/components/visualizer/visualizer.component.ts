import {Component, OnDestroy, OnInit} from '@angular/core';
import AudioMotionAnalyzer, {GradientOptions, Options} from 'audiomotion-analyzer';
import {ColorService} from '../../services/color/color.service';
import {faExpand} from '@fortawesome/free-solid-svg-icons/faExpand';
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave';
import {faFileDownload} from '@fortawesome/free-solid-svg-icons/faFileDownload';
import {faEdit, faLightbulb, faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChromaEffectService} from '../../services/chromaEffect/chroma-effect.service';
import {VisualizerState} from '../../services/chromaEffect/state/visualizer-state/visualizer-state';
import {SettingsService} from '../../services/settings/settings.service';
import {ConnectionService} from '../../services/connection/connection.service';
import {TimelineMax} from 'gsap';
import {GradientInformationExtended} from '../../types/GradientInformation';


@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit, OnDestroy {
  options: Options = {
    ...this.settingsService.readVisualizerOptions(), ...{
      gradient: 'rainbow',
      volume: 0,
      onCanvasDraw: this.drawCallback.bind(this)
    }
  };
  // Gradient definitions
  gradients: GradientInformationExtended[] = undefined;
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
  // Properties that may be changed by Random Mode
  randomProperties = [
    {value: 'nobg', text: 'Background', disabled: false},
    {value: 'imgfit', text: 'Image Fit', disabled: false},
    {value: 'reflex', text: 'Reflex', disabled: false},
    {value: 'peaks', text: 'PEAKS', disabled: false},
    {value: 'leds', text: 'LEDS', disabled: false},
    {value: 'lumi', text: 'LUMI', disabled: false},
    {value: 'barSp', text: 'Bar Spacing', disabled: false},
    {value: 'line', text: 'Line Width', disabled: false},
    {value: 'fill', text: 'Fill Opacity', disabled: false},
    {value: 'radial', text: 'Radial', disabled: false},
    {value: 'spin', text: 'Spin', disabled: false}
  ];
  smoothingConfig = {
    connect: 'lower',
    start: this.options.smoothing,
    step: 0.1,
    range: {
      min: 0,
      max: 0.9
    },
  };
  frequencyLimits = [this.options.minFreq, this.options.maxFreq];
  frequencyLimitsConfig = {
    behaviour: 'drag',
    connect: true,
    start: [this.options.minFreq, this.options.maxFreq],
    range: {
      min: 20,
      max: 22000
    },
    step: 10,
  };
  spinSpeedConfig = {
    connect: 'lower',
    start: this.options.spinSpeed,
    step: 1,
    range: {
      min: 0,
      max: 50
    },
  };
  fullscreenIcon = faExpand;
  lineWidthConfig = {
    connect: 'lower',
    start: this.options.lineWidth,
    step: 1,
    range: {
      min: 1,
      max: 5
    },
  };
  bgAlphaConfig = {
    connect: 'lower',
    start: this.options.fillAlpha,
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
  private audioMotion: AudioMotionAnalyzer;
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
    private chromaEffect: ChromaEffectService) {
  }

  ngOnDestroy(): void {
    this.audioMotion.toggleAnalyzer();
  }

  ngOnInit(): void {
    this.init();
    this.chromaEffect.state = new VisualizerState();

    this.timeline = new TimelineMax();
    if (localStorage.getItem('dismissedSettingsPopup') !== 'true') {
      this.timeline.to('#overlay', {duration: 1, opacity: 1}, '+=1.8');
    }
  }

  updateLedstrip(): void {
    this.connection.setMode(55);
    this.connection.setColor(this.colorService.getColors);
  }

  drawCallback(instance: AudioMotionAnalyzer): void {
    const value = instance.getEnergy('bass');
    this.connection.setLeds(value);
    this.chromaEffect.intensity = value;
  }

  updateOptions(): void {
    this.audioMotion.setOptions(this.options);
    this.registerGradients(this.gradients).then();
  }

  changeGradient(gradientIndex: number): void {
    this.options.gradient = this.gradients[gradientIndex].name;
    this.updateOptions();
  }

  changeReflex(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    switch (+value) {
      case 1:
        this.options.reflexRatio = .4;
        this.options.reflexAlpha = .2;
        break;

      case 2:
        this.options.reflexRatio = .5;
        this.options.reflexAlpha = 1;
        break;

      default:
        this.options.reflexRatio = 0;
    }
    this.updateOptions();
  }

  fullscreen(): void {
    this.audioMotion.toggleFullscreen();
  }

  changeShowScale(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options.showScaleX = !!(+value & 1);
    this.options.showScaleY = !!(+value & 2);
    this.updateOptions();
  }

  changeFrequencyLimit(): void {
    this.options.minFreq = this.frequencyLimits[0];
    this.options.maxFreq = this.frequencyLimits[1];
    this.updateOptions();
  }

  changeDisplay($event: Event): void {
    const element = $event.currentTarget as HTMLElement;

    this.options.showLeds = false;
    this.options.lumiBars = false;
    this.options.radial = false;

    if (element.id === 'leds') {
      this.options.showLeds = true;
    } else if (element.id === 'lumi') {
      this.options.lumiBars = true;
    } else if (element.id === 'radial') {
      this.options.radial = true;
    } else {
      throw Error('Unknown ID!');
    }
    this.updateOptions();
  }

  changeGeneralSettings($event: Event): void {
    const element = $event.target as HTMLInputElement;

    const value = element.checked;

    if (element.id === 'peaks') {
      this.options.showPeaks = value;
    } else if (element.id === 'lores') {
      this.options.loRes = value;
    } else if (element.id === 'fps') {
      this.options.showFPS = value;
    } else {
      throw Error('Unknown ID!');
    }
    this.updateOptions();
  }

  updateMode(event: Event): void {
    let value = +(event.target as HTMLInputElement).value;
    switch (+value) {
      case 10:
        this.options.lineWidth = 0;
        this.options.fillAlpha = 1;
        break;
      case 11:
        this.options.lineWidth = 5;
        this.options.fillAlpha = 0.1;
        value = 10;
        break;
    }

    this.options.mode = value;
    this.updateOptions();
  }

  loadOptions(): void {
    this.options = this.settingsService.readVisualizerOptions();
  }

  saveOptions(): void {
    this.settingsService.saveVisualizerOptions(this.options);
  }

  private setSource(): void {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then(stream => {
        const audioCtx = this.audioMotion.audioCtx;
        const micInput = audioCtx.createMediaStreamSource(stream);
        this.audioMotion.disconnectInput();
        this.audioMotion.connectInput(micInput);
      })
      .catch(err => {
        console.error(`Could not change audio source - ${err}`, err);
      });
  }

  private async getGradients(): Promise<GradientInformationExtended[]> {
    const gradients = await this.connection.getGradients() as GradientInformationExtended[];
    for (const gradient of gradients) {
      gradient.collapsed = true;
      gradient.sliderOptions = this.defaultSliderOptions;
    }

    return gradients;
  }

  private async registerGradients(gradients: GradientInformationExtended[]): Promise<void> {
    if (!gradients) {
      this.gradients = await this.getGradients();
    }

    this.gradients.forEach((gradient, index: number) => {
      this.audioMotion.registerGradient(gradient.name, {
        bgColor: gradient.bgColor,
        colorStops: gradient.colorStops
      } as GradientOptions);
    });
  }

  private init(): void {
    const elem = document.getElementById('visualizer');

    this.audioMotion = new AudioMotionAnalyzer(
      elem,
      this.options
    );
    this.setSource();
    this.registerGradients(this.gradients).then(() => {
      this.loadOptions();
    });

    setTimeout(() => {
      this.updateLedstrip();
    }, 2000);
  }

  scroll(el: HTMLDivElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  dismissOverlay(): void {
    this.timeline.to('#overlay', {duration: 1, opacity: 0});
    this.timeline.to('#overlay', {duration: 0.5, visibility: 'hidden'});
    localStorage.setItem('dismissedSettingsPopup', 'true');
  }

  submitGradient(gradient: GradientInformationExtended): void {
    this.options.gradient = gradient.name;
    this.updateOptions();
  }
}
