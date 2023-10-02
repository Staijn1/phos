import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import AudioMotionAnalyzer, { GradientColorStop, GradientOptions } from "audiomotion-analyzer";
import { faCheck, faExpand, faLightbulb, faList, faSliders, faWrench } from "@fortawesome/free-solid-svg-icons";
import { ChromaEffectService } from "../../services/chromaEffect/chroma-effect.service";
import { VisualizerComponent } from "../../shared/components/visualizer/visualizer.component";
import { GradientInformation, LedstripState } from "@angulon/interfaces";
import { OffCanvasComponent } from "../../shared/components/offcanvas/off-canvas.component";
import * as slider from "ngx-slider-v2";
import { InformationService } from "../../services/information-service/information.service";
import { visualizerModeId } from "../../shared/constants";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { Store } from "@ngrx/store";
import { ChangeLedstripColors, ChangeLedstripMode } from "../../../redux/ledstrip/ledstrip.action";
import { WebsocketService } from "../../services/websocketconnection/websocket.service";
import { mapNumber } from "../../shared/functions";
import { AngulonVisualizerOptions, UserPreferences } from "../../shared/types/types";
import { combineLatest, distinctUntilChanged, map, skipWhile } from "rxjs";
import { ChangeVisualizerOptions } from "../../../redux/user-preferences/user-preferences.action";

@Component({
  selector: "app-visualizer",
  templateUrl: "./visualizer-page.component.html",
  styleUrls: ["./visualizer-page.component.scss"]
})
export class VisualizerPageComponent implements OnDestroy {
  @ViewChild(VisualizerComponent) visualizerComponent!: VisualizerComponent;
  @ViewChild(OffCanvasComponent) offcanvas!: OffCanvasComponent;
  visualizerOptions: AngulonVisualizerOptions = {};

  // Gradient definitions
  gradients: GradientInformation[] = [];
  // Visualization modes
  modes = [
    { value: 0, text: "Discrete frequencies", disabled: false },
    { value: 1, text: "1/24th octave bands", disabled: false },
    { value: 2, text: "1/12th octave bands", disabled: false },
    { value: 3, text: "1/8th octave bands", disabled: false },
    { value: 4, text: "1/6th octave bands", disabled: false },
    { value: 5, text: "1/4th octave bands", disabled: false },
    { value: 6, text: "1/3rd octave bands", disabled: false },
    { value: 7, text: "Half octave bands", disabled: false },
    { value: 8, text: "Full octave bands", disabled: false },
    { value: 10, text: "Area graph", disabled: false }
  ];

  settingsIcon = faWrench;
  fullscreenIcon = faExpand;
  modeIcon = faLightbulb;
  smoothingSliderOptions: slider.Options = {
    floor: 0,
    ceil: 1,
    step: 0.05
  };
  spinSpeedSliderOptions: slider.Options = {
    floor: 0,
    ceil: 20,
    step: 1
  };
  frequencySliderOptions: slider.Options = {
    floor: 20,
    ceil: 22000,
    minRange: 10,
    pushRange: true,
    noSwitching: true
  };
  lineWidthSliderOptions: slider.Options = {
    floor: 0,
    ceil: 10
  };
  fillAlphaSliderOptions: slider.Options = {
    floor: 0,
    ceil: 1,
    step: 0.1
  };
  reflexSliderOptions: slider.Options = {
    floor: 0,
    ceil: 1,
    step: 0.1,
    vertical: true
  };
  linearBoostSliderOptions: slider.Options = {
    floor: 1,
    ceil: 5,
    step: 0.1
  };
  activeTab = 0;
  listIcon = faList;
  checkboxIcon = faCheck;
  sliderIcon = faSliders;
  readonly spotifyIcon = faSpotify;
  private wakeLock: any;
  private currentTrackId: string | null | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private connection: WebsocketService,
    private information: InformationService,
    private chromaEffect: ChromaEffectService,
    private store: Store<{
      ledstripState: LedstripState | undefined,
      gradients: GradientInformation[],
      userPreferences: UserPreferences
    }>
  ) {
  }

  /**
   * For the current selected mode, find the corresponding mode object
   * If the name of the mode includes octave then return true
   */
  get isOctaveBandMode() {
    const currentMode = this.visualizerOptions.mode;
    const mode = this.modes.find((mode) => mode.value === currentMode);
    return mode?.text.includes("octave");
  }

  init(): void {
    combineLatest([
      this.store.select("userPreferences").pipe(map(userPref => userPref.visualizerOptions)),
      this.store.select("gradients").pipe(skipWhile(gradients => gradients.length === 0))])
      .pipe(distinctUntilChanged())
      .subscribe(([visualizerOptions, gradients]) => {
        console.log(visualizerOptions, gradients);
        // Create a clone otherwise you will receive "Object is not extensible" error if Audiomotion decides to update the gradient when registering it
        // This method of assigning will also trigger change detection in the visualizer component, causing it to register the gradients
        this.gradients = structuredClone(gradients);

        this.visualizerComponent.registerGradients(this.gradients);
        this.cdr.detectChanges();
        // Set some overrides on the settings before applying
        const settingsToApply = { ...visualizerOptions };

        settingsToApply.onCanvasDraw = this.drawCallback.bind(this);
        if (settingsToApply.gradientRight === "Spotify" || settingsToApply.gradientLeft === "Spotify" || settingsToApply.gradient === "Spotify") {
          settingsToApply.gradient = "prism";
          settingsToApply.gradientLeft = "prism";
          settingsToApply.gradientRight = "prism";
        }

        this.visualizerOptions = settingsToApply;
        this.cdr.detectChanges();
      });

    if ("wakeLock" in navigator) {
      const anyNavigator = navigator as any;
      anyNavigator.wakeLock.request("screen").then((lock: any) => {
        this.wakeLock = lock;
      }).catch((error: any) => {
        console.error("Failed to request wake lock", error);
      });
    }
  }

  ngOnDestroy(): void {
    this.gradients = [];
    this.wakeLock?.release()
      .then()
      .catch((error: any) => console.error("Failed to release wake lock", error));
  }

  updateLedstrip(): void {
    this.store.dispatch(new ChangeLedstripMode(visualizerModeId));
  }

  drawCallback(instance: AudioMotionAnalyzer): void {
    const value = instance.getEnergy("bass");
    this.connection.sendFFTValue(Math.floor(mapNumber(value, 0, 1, 0, 255)));
    this.chromaEffect.intensity = value;
  }

  fullscreen(): void {
    this.visualizerComponent.toggleFullscreen();
  }

  toggleSettingsWindow() {
    this.offcanvas.toggle();
  }

  applySettings() {
    this.visualizerOptions = Object.assign({}, this.visualizerOptions);
    this.store.dispatch(new ChangeVisualizerOptions(this.visualizerOptions));
  }

  closeOffcanvas() {
    this.offcanvas.close();
  }

  /**
   * Fired when the spotify player state changes
   * This handler checks if the song has changed and if so, it will extract the average colors from the album cover
   * Then it creates a gradient from the colors and sets it as the current gradient in the visualizer
   * Then it will send the average colors to the ledstrip
   * @param state
   */
  onSpotifyStateChanged(state: Spotify.PlaybackState) {
    if (state?.track_window?.current_track?.id !== this.currentTrackId) {
      this.currentTrackId = state?.track_window?.current_track?.id;
      const albumCover = state?.track_window?.current_track?.album?.images[0]?.url;
      if (albumCover) {
        this.information.getColorsFromImageUrl(albumCover).then((colors) => {
          const primaryColor = colors.Average.hex;
          const secondaryColor = colors.Vibrant?.hex ?? "#000";
          const colorsStops: GradientColorStop[] = [
            {
              color: primaryColor,
              pos: 0
            },
            {
              color: secondaryColor,
              pos: 1
            }
          ];

          const gradient: GradientOptions = {
            bgColor: "#000",
            colorStops: colorsStops
          };
          this.visualizerComponent.registerGradient("Spotify", gradient);
          this.visualizerOptions.gradient = "Spotify";
          this.visualizerOptions.gradientLeft = "Spotify";
          this.visualizerOptions.gradientRight = "Spotify";
          this.applySettings();
          this.store.dispatch(new ChangeLedstripColors([primaryColor, secondaryColor]));
        });
      }
    }
  }
}
