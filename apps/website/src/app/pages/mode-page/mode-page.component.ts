import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {StaticState} from "../../services/chromaEffect/state/static-state/static-state";
import {ChromaEffectService} from "../../services/chromaEffect/chroma-effect.service";
import {BlinkState} from "../../services/chromaEffect/state/blink-state/blink-state";
import {SingleDynamicState} from "../../services/chromaEffect/state/single-dynamic-state/single-dynamic-state";
import {MultiDynamicState} from "../../services/chromaEffect/state/multi-dynamic-state/multi-dynamic-state";
import {RainbowState} from "../../services/chromaEffect/state/rainbow-state/rainbow-state";
import {Fire2012State} from "../../services/chromaEffect/state/fire2012-state/fire2012-state";
import {WaterfallState} from "../../services/chromaEffect/state/waterfall-state/waterfall-state";
import {RainbowCycleState} from "../../services/chromaEffect/state/rainbow-cycle-state/rainbow-cycle-state";
import {VisualizerState} from "../../services/chromaEffect/state/visualizer-state/visualizer-state";
import {LedstripPreset, ModeInformation, Segment} from "@angulon/interfaces";
import {themes} from "../../shared/constants";
import {ThemeService} from "../../services/theme/theme.service";
import {WebsocketService} from "../../services/websocketconnection/websocket.service";
import {
  VisualizerBrightnessState
} from "../../services/chromaEffect/state/visualizer-brightness-state/visualizer-brightness-state";
import {ChangeContext, Options} from "@angular-slider/ngx-slider";
import {ColorpickerComponent, ColorpickerEvent} from "../../shared/components/colorpicker/colorpicker.component";
import {NgbAccordion} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, map, Observable} from "rxjs";
import {faChevronDown, faChevronLeft} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: "app-mode",
  templateUrl: "./mode-page.component.html",
  styleUrls: ["./mode-page.component.scss"]
})
export class ModePageComponent implements OnInit, OnDestroy {
  @ViewChild(ColorpickerComponent) colorpicker: ColorpickerComponent | undefined;
  @ViewChild(NgbAccordion) accordion: NgbAccordion | undefined;

  modes: ModeInformation[] = [];
  chromaEffects = [
    {name: "Rainbow", state: new RainbowState()},
    {name: "Rainbow Cycle", state: new RainbowCycleState()},
    {name: "Multi Dynamic", state: new MultiDynamicState()},
    {name: "Single Dynamic", state: new SingleDynamicState()},
    {name: "Blink", state: new BlinkState()},
    {name: "Fire2012", state: new Fire2012State()},
    {name: "Waterfall", state: new WaterfallState()},
    {name: "VuMeter", state: new VisualizerState()},
    {name: "VuMeter Brightness", state: new VisualizerBrightnessState()}
  ];
  classes = themes;
  selectedMode = 0;
  activeTab = 0;
  selectedPreset: LedstripPreset | undefined;
  ledstripPresets: LedstripPreset[] = [];
  brightnessSliderOptions: Options = {
    floor: 0,
    ceil: 255,
    step: 1
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
  readonly accordionIconClosed = faChevronLeft;
  readonly accordionIconOpen = faChevronDown;
  /**
   * This variable holds the mode to display in the custom mode selector for a segment
   */
  typeaheadModel: ModeInformation | undefined;
  modeTypeaheadFormatter = (state: ModeInformation) => state.name || 'Unknown Mode Name';

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => this.modes.filter((state) => new RegExp(term, "mi").test(state.name as string)).slice(0, 10))
    );


  constructor(
    private readonly connection: WebsocketService,
    private readonly chromaService: ChromaEffectService,
    public readonly themeService: ThemeService) {
  }

  ngOnDestroy(): void {
    this.modes = [];
  }

  ngOnInit(): void {
    this.connection.getModes().then(modes => {
      this.modes = modes;
    });
  }

  /**
   * Fired when the user clicks on a mode button
   * @param {MouseEvent} $event
   */
  onModeSelect($event: MouseEvent): void {
    const id = parseInt(($event.currentTarget as HTMLElement).id, 10);
    this.selectedMode = id;

    this.connection.setMode(id);

    const state = this.chromaEffects.find(stateToCompare => {
      const mode = this.modes[id];
      if (!mode) return false;
      return stateToCompare.name.toLowerCase() === mode.name?.toLowerCase();
    });

    this.chromaService.state = state === undefined ? new StaticState() : state.state;
  }

  onBrightnessChange(event: ChangeContext) {
    if (!this.selectedPreset) return;
    this.selectedPreset.brightness = event.value;
    this.onPresetChange();
  }

  addPreset(): void {
    const newPreset = {
      name: "New Preset",
      brightness: 64,
      segments: [
        {start: 0, stop: 9, mode: 0, speed: 1000, options: 0, colors: ["#ff0000", "#00ff00", "#0000ff"]}
      ]
    };

    // The index of the newly inserted preset is the new length of presets (returned by push) - 1
    const index = this.ledstripPresets.push(newPreset) - 1;
    this.selectPreset(newPreset);
    // Expand the newly created preset
    if (this.accordion) {
      setTimeout(() => this.accordion?.expand(`ngb-panel.${index}`), 100);
    }
  }

  deletePreset(preset: LedstripPreset): void {
    const index = this.ledstripPresets.indexOf(preset);
    this.ledstripPresets.splice(index, 1);
    this.selectedPreset = this.ledstripPresets[0];
  }

  onSegmentRangeChange(event: ChangeContext): void {
    if (!this.selectedSegment) return;
    this.selectedSegment.start = event.value;
    this.selectedSegment.stop = event.highValue as number;
    this.onPresetChange()
  }

  onSpeedChange(event: ChangeContext): void {
    if (!this.selectedSegment) return;
    this.selectedSegment.speed = event.value;
    this.onPresetChange()
  }

  onSegmentColorsChange(event: ColorpickerEvent): void {
    if (!this.selectedSegment) return;
    this.selectedSegment.colors = event.colorpicker.colors.map(color => color.hexString);
    this.onPresetChange()
  }

  selectPreset(preset: LedstripPreset): void {
    this.selectedPreset = preset;
    this.selectSegment(preset.segments[0]);
    this.onPresetChange()
  }

  selectSegment(segment: Segment, event?: Event): void {
    event?.stopPropagation();
    this.selectedSegment = segment;
    if (!this.colorpicker) return;
    this.colorpicker.updateColors(segment.colors);
    this.setSegmentModeModel(segment.mode)
  }

  removeSegment(index: number): void {
    this.selectedPreset?.segments.splice(index, 1);
  }

  addSegment(): void {
    if (!this.selectedPreset) return;
    const lastSegment = this.selectedPreset.segments[this.selectedPreset?.segments.length - 1];
    const newSegmentStop = 60;
    const newSegmentStart = Math.min(lastSegment.stop + 1, 60);
    const newSegmentMode = 0;
    this.selectedPreset.segments.push({
      colors: ["#ff0000", "#00ff00", "#0000ff"],
      mode: newSegmentMode,
      options: 0,
      speed: 1000,
      start: newSegmentStart,
      stop: newSegmentStop
    });
    this.selectSegment(this.selectedPreset.segments[this.selectedPreset.segments.length - 1])
  }

  /**
   * Update the mode number in the selectedSegment when selecting a mode using the mode selector OR
   * Update the mode selector model based on the newly selected segment
   * @param modeNumber
   */
  setSegmentModeModel(modeNumber?: number) {
    if (modeNumber) {
      this.typeaheadModel = this.modes.find(mode => mode.mode == modeNumber)
    } else {
      if (this.selectedSegment) {
        this.selectedSegment.mode = this.typeaheadModel?.mode || 0;
        this.onPresetChange()
      }
    }
  }

  private onPresetChange() {
    if (!this.selectedPreset) return;
    this.connection.setPreset(this.selectedPreset);
  }

  onPanelShow(panelId: string) {
    const selectedPresetIndex = Number(panelId.split(".")[1]);
    this.selectPreset(this.ledstripPresets[selectedPresetIndex]);
  }
}
