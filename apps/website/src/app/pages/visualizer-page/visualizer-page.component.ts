import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import AudioMotionAnalyzer, { GradientColorStop, GradientOptions } from "audiomotion-analyzer";
import {
  faCheck,
  faExpand,
  faLightbulb,
  faList,
  faSliders,
  faTimes,
  faWrench
} from "@fortawesome/free-solid-svg-icons";
import { OldChromaEffectService } from "../../services/old/chromaEffect/old-chroma-effect.service";
import { VisualizerComponent } from "../../shared/components/visualizer/visualizer.component";
import { GradientInformation, LedstripState } from "@angulon/interfaces";
import { OffCanvasComponent } from "../../shared/components/offcanvas/off-canvas.component";
import * as slider from "ngx-slider-v2";
import { NgxSliderModule } from "ngx-slider-v2";
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
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SharedModule } from "../../shared/shared.module";
import { SpotifyAuthenticationService } from "../../services/spotify-authentication/spotify-authentication.service";
import { RegisterGradientAction } from "../../../redux/gradients/gradients.action";
import iro from "@jaames/iro";

@Component({
  selector: "app-visualizer",
  templateUrl: "./visualizer-page.component.html",
  styleUrls: ["./visualizer-page.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, SharedModule, NgxSliderModule]
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
  readonly listIcon = faList;
  readonly checkboxIcon = faCheck;
  readonly sliderIcon = faSliders;
  readonly closeIcon = faTimes;
  readonly spotifyIcon = faSpotify;
  private wakeLock: WakeLockSentinel | undefined;
  private currentTrackId: string | null | undefined;
  private spotifyPlaybackState: Spotify.PlaybackState | undefined;
  private albumCoverHTMLElement: HTMLImageElement | undefined;


  constructor(
    private cdr: ChangeDetectorRef,
    private connection: WebsocketService,
    private information: InformationService,
    private chromaEffect: OldChromaEffectService,
    public spotifyAuth: SpotifyAuthenticationService,
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
        // Create a clone otherwise you will receive "Object is not extensible" error if Audiomotion decides to update the gradient when registering it
        // This method of assigning will also trigger change detection in the visualizer component, causing it to register the gradients
        this.gradients = structuredClone(gradients);

        this.visualizerComponent.registerGradients(this.gradients);
        this.cdr.detectChanges();
        // Set some overrides on the settings before applying
        const settingsToApply = { ...visualizerOptions };

        settingsToApply.onCanvasDraw = this.drawCallback.bind(this);

        this.visualizerOptions = settingsToApply;
        this.cdr.detectChanges();
      });

    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then((lock: WakeLockSentinel) => {
        this.wakeLock = lock;
      }).catch((error) => {
        console.error("Failed to request wake lock", error);
      });
    }
  }

  ngOnDestroy(): void {
    this.gradients = [];
    this.wakeLock?.release()
      .then()
      .catch((error: Error) => console.error("Failed to release wake lock", error));
  }

  updateLedstrip(): void {
    this.store.dispatch(new ChangeLedstripMode(visualizerModeId));
  }

  drawCallback(instance: AudioMotionAnalyzer): void {
    const ctx = instance.canvasCtx;
    const canvas = instance.canvas;

    // Send the fft value to the ledstrip and update the chroma effect
    const value = instance.getEnergy("bass");
    this.connection.sendFFTValue(Math.floor(mapNumber(value, 0, 1, 0, 255)));
    this.chromaEffect.intensity = value;



    // Draw the album cover of the current song on the canvas in the top right
    if (this.spotifyPlaybackState && this.albumCoverHTMLElement) {
      const margin = 25;
      const imageSize = 250;
      ctx.globalAlpha = .7;
      this.albumCoverHTMLElement.style.borderRadius = getComputedStyle(document.documentElement).getPropertyValue("--rounded-btn") ?? 0;
      ctx.drawImage(this.albumCoverHTMLElement, canvas.width - (margin + imageSize), margin, imageSize, imageSize);
      ctx.globalAlpha = 1;
    }
  }

  fullscreen(): void {
    this.visualizerComponent.toggleFullscreen();
  }

  toggleSettingsWindow() {
    this.offcanvas.toggle();
  }

  applySettings() {
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
    this.spotifyPlaybackState = state;

    if (this.spotifyPlaybackState?.track_window?.current_track?.id !== this.currentTrackId) {
      this.currentTrackId = state?.track_window?.current_track?.id;
      const albumCoverImageUrl = state?.track_window?.current_track?.album?.images[0]?.url;
      if (albumCoverImageUrl) {
        // This variable will be used to draw the album cover on the canvas. It is added to the canvas with the drawCallback
        // This is called many times per second so for performance reasons we load the image only once and then draw it on the canvas many times
        this.albumCoverHTMLElement = new Image();
        this.albumCoverHTMLElement.src = albumCoverImageUrl;

        this.information.getColorsFromImageUrl(albumCoverImageUrl).then((colors) => {
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

          this.store.dispatch(new ChangeLedstripColors([new iro.Color(primaryColor), new iro.Color(secondaryColor)]));
          this.store.dispatch(new RegisterGradientAction({...gradient, name: "spotify", id: 999}));

          this.visualizerOptions.gradientLeft = "spotify";
          this.visualizerOptions.gradientRight = "spotify";
          this.applySettings();
        });
      }
    }
  }

  /**
   * Select a new tab with the given index
   * @param index
   */
  selectTab(index: number) {
    this.activeTab = index;
  }
}
