import {Component, OnDestroy, OnInit} from '@angular/core'
import {StaticState} from '../../services/chromaEffect/state/static-state/static-state'
import {ChromaEffectService} from '../../services/chromaEffect/chroma-effect.service'
import {BlinkState} from '../../services/chromaEffect/state/blink-state/blink-state'
import {SingleDynamicState} from '../../services/chromaEffect/state/single-dynamic-state/single-dynamic-state'
import {MultiDynamicState} from '../../services/chromaEffect/state/multi-dynamic-state/multi-dynamic-state'
import {RainbowState} from '../../services/chromaEffect/state/rainbow-state/rainbow-state'
import {Fire2012State} from '../../services/chromaEffect/state/fire2012-state/fire2012-state'
import {WaterfallState} from '../../services/chromaEffect/state/waterfall-state/waterfall-state'
import {RainbowCycleState} from '../../services/chromaEffect/state/rainbow-cycle-state/rainbow-cycle-state'
import {VisualizerState} from '../../services/chromaEffect/state/visualizer-state/visualizer-state'
import {ModeInformation} from '@angulon/interfaces';
import {themes} from '../../shared/constants';
import {ThemeService} from '../../services/theme/theme.service';
import {WebsocketService} from '../../services/websocketconnection/websocket.service';
import {
  VisualizerBrightnessState
} from '../../services/chromaEffect/state/visualizer-brightness-state/visualizer-brightness-state';
import {ChangeContext, LabelType, Options} from "@angular-slider/ngx-slider";
import {ColorpickerEvent} from "../../shared/components/colorpicker/colorpicker.component";

interface LedstripPreset {
  name: string;
  brightness: number;
  segments: Segment[];
}

interface Segment {
  start: number;
  stop: number;
  mode: number;
  speed: number;
  options: number;
  colors: string[];
}

@Component({
  selector: 'app-mode',
  templateUrl: './mode-page.component.html',
  styleUrls: ['./mode-page.component.scss'],
})
export class ModePageComponent implements OnInit, OnDestroy {
  modes: ModeInformation[] = [];
  chromaEffects = [
    {name: 'Rainbow', state: new RainbowState()},
    {name: 'Rainbow Cycle', state: new RainbowCycleState()},
    {name: 'Multi Dynamic', state: new MultiDynamicState()},
    {name: 'Single Dynamic', state: new SingleDynamicState()},
    {name: 'Blink', state: new BlinkState()},
    {name: 'Fire2012', state: new Fire2012State()},
    {name: 'Waterfall', state: new WaterfallState()},
    {name: 'VuMeter', state: new VisualizerState()},
    {name: 'VuMeter Brightness', state: new VisualizerBrightnessState()},
  ];
  classes = themes;
  selectedMode = 0;
  activeTab = 0;
  selectedPreset: LedstripPreset | undefined;
  ledstripPresets: LedstripPreset[] = []
  brightnessSliderOptions: Options = {
    floor: 0,
    ceil: 255,
    step: 1,
  };
  selectedSegment: Segment | undefined;
  speedSliderOptions = {
    floor: 0,
    ceil: 10000,
    step: 100
  };
  rangeSliderOptions: Options = {
    floor: 0,
    // todo the maximum should depend on the ledstrip
    ceil: 60
  };

  constructor(
    private readonly connection: WebsocketService,
    private readonly chromaService: ChromaEffectService,
    public readonly themeService: ThemeService) {
  }

  ngOnDestroy(): void {
    this.modes = []
  }

  ngOnInit(): void {
    this.connection.getModes().then(modes => {
      this.modes = modes
    })
  }

  /**
   * Fired when the user clicks on a mode button
   * @param {MouseEvent} $event
   */
  onModeSelect($event: MouseEvent): void {
    const id = parseInt(($event.currentTarget as HTMLElement).id, 10)
    this.selectedMode = id

    this.connection.setMode(id)

    const state = this.chromaEffects.find(stateToCompare => {
      const mode = this.modes[id];
      if (!mode) return false;
      return stateToCompare.name.toLowerCase() === mode.name?.toLowerCase()
    })

    this.chromaService.state = state === undefined ? new StaticState() : state.state
  }

  onBrightnessChange(event: ChangeContext) {
    if (!this.selectedPreset) return;
    this.selectedPreset.brightness = event.value;
  }

  addPreset() {
    const newPreset = {
      name: 'New Preset',
      brightness: 64,
      segments: [
        { start: 0, stop: 9, mode: 0, speed: 1000, options: 0, colors: ['#ff0000', '#00ff00', '#0000ff'] }
      ]
    };


    this.ledstripPresets.push(newPreset);
    this.selectPreset(newPreset)
  }

  deletePreset(preset: LedstripPreset) {
    const index = this.ledstripPresets.indexOf(preset);
    this.ledstripPresets.splice(index, 1);
    this.selectedPreset = this.ledstripPresets[0];
  }

  onSegmentRangeChange(event: ChangeContext) {
    if(!this.selectedSegment) return;
    this.selectedSegment.start = event.value;
    this.selectedSegment.stop = event.highValue as number;
  }

  onSpeedChange(event: ChangeContext) {
    if(!this.selectedSegment) return;
    this.selectedSegment.speed = event.value;
  }

  onSegmentColorsChange(event: ColorpickerEvent) {
    if(!this.selectedSegment) return;
    this.selectedSegment.colors = event.colorpicker.colors.map(color => color.hexString)
  }

  selectPreset(preset: LedstripPreset) {
    this.selectedPreset = preset;
    this.selectedSegment = preset.segments[0];
  }
}
