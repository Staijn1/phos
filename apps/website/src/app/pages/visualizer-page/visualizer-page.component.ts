import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import AudioMotionAnalyzer, { GradientColorStop, GradientOptions } from "audiomotion-analyzer";
import { faExpand } from "@fortawesome/free-solid-svg-icons/faExpand";
import { faCheck, faLightbulb, faList, faSliders, faWrench } from "@fortawesome/free-solid-svg-icons";
import { ChromaEffectService } from "../../services/chromaEffect/chroma-effect.service";
import { SettingsService } from "../../services/settings/settings.service";
import { VisualizerComponent } from "../../shared/components/visualizer/visualizer.component";
import { AngulonVisualizerOptions, GradientInformation } from "@angulon/interfaces";
import { OffCanvasComponent } from "../../shared/components/offcanvas/off-canvas.component";
import * as slider from "@angular-slider/ngx-slider";
import { InformationService } from "../../services/information-service/information.service";
import { visualizerModeId } from "../../shared/constants";
import { WebsocketService } from "../../services/websocketconnection/websocket.service";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { getDeviceType } from "../../shared/functions";
import { Store } from "@ngrx/store";
import { ColorpickerState } from "../../../redux/color/color.reducer";
import { colorChange } from "../../../redux/color/color.action";

/// <reference types="@types/spotify-web-playback-sdk" />
declare global {
  interface window {
    onSpotifyWebPlaybackSDKReady: () => void;
    spotifyReady: Promise<void>;
  }
}

@Component({
  selector: "app-visualizer",
  templateUrl: "./visualizer-page.component.html",
  styleUrls: ["./visualizer-page.component.scss"]
})
export class VisualizerPageComponent implements OnInit, OnDestroy {
  private spotifyPlayer!: Spotify.Player;
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
  private player: Spotify.Player | undefined;
  private currentTrackId: string | null | undefined;

  constructor(
    private connection: WebsocketService,
    private information: InformationService,
    private settingsService: SettingsService,
    private chromaEffect: ChromaEffectService,
    private store: Store<{ colorpicker: ColorpickerState }>
  ) {
  }

  ngOnInit(): void {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = "BQClkBuVMzQZY5hkxPzO20fYWCxB38gtB7kehSDjRplXXGUI5q1bfYaqPhX9Z62wqc5XdGcM_WbJ1gAvASiXR444559_AIR0p5toDbCTN-Ld62FiI-4NKLz1tgR9JW9hmv94Ts04rBdKbhHmKefjpJDsVF2sKhShGuifzN_mlDA8syR8GweJUWHCID7tnKdh1W1x9eONSz4";
      const device = getDeviceType();
      this.player = new Spotify.Player({
        name: `Angulon - ${device}`,
        getOAuthToken: cb => {
          cb(token);
        },
        volume: 1
      });

      this.player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      this.player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      this.player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      // Ready
      this.player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      // Not Ready
      this.player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
      this.player.addListener("player_state_changed", state => this.onSpotifyStateChanged(state));
      this.player.connect();
    };
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

  ngOnDestroy(): void {
    this.gradients = [];
    this.wakeLock?.release()
      .then()
      .catch((error: any) => console.error("Failed to release wake lock", error));
  }

  updateLedstrip(): void {
    this.connection.setMode(visualizerModeId);
  }

  drawCallback(instance: AudioMotionAnalyzer): void {
    const value = instance.getEnergy(this.visualizerOptions.energyPreset);
    console.log(value);
    this.connection.setLeds(value);
    this.chromaEffect.intensity = value;
  }

  fullscreen(): void {
    this.visualizerComponent.toggleFullscreen();
  }

  init(): void {
    this.information.getGradients().then((gradients) => {
      this.gradients = gradients;
      // this.chromaEffect.state = new VisualizerBrightnessState()
    }).catch(e => {
      this.readSettings();
      this.applySettings();
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

  readSettings() {
    const settings = this.settingsService.readVisualizerOptions();
    settings.onCanvasDraw = this.drawCallback.bind(this);
    if (settings.gradientRight === "Spotify" || settings.gradientLeft === "Spotify" || settings.gradient === "Spotify") {
      settings.gradient = "prism";
      settings.gradientLeft = "prism";
      settings.gradientRight = "prism";
    }
    this.visualizerOptions = settings;
  }

  openSettingsWindow() {
    this.offcanvas.open({
      position: "end",
      backdropClass: "offcanvas-backdrop-custom"
    });
  }

  applySettings() {
    this.visualizerOptions = Object.assign({}, this.visualizerOptions);
    this.settingsService.saveVisualizerOptions(this.visualizerOptions);
  }

  closeOffcanvas() {
    this.offcanvas.close();
  }

  /**
   * Pauses or unpause the spotify player
   */
  toggleSpotifyPlayerPlay() {
    this.player?.togglePlay();
  }

  /**
   * Fired when the spotify player state changes
   * This handler checks if the song has changed and if so, it will extract the average colors from the album cover
   * Then it creates a gradient from the colors and sets it as the current gradient in the visualizer
   * Then it will send the average colors to the ledstrip
   * @param {Spotify.PlaybackState} state
   * @private
   */
  private onSpotifyStateChanged(state: Spotify.PlaybackState) {
    if (state?.track_window?.current_track?.id !== this.currentTrackId) {
      this.currentTrackId = state?.track_window?.current_track?.id;
      const albumCover = state?.track_window?.current_track?.album?.images[0]?.url;
      if (albumCover) {
        this.information.getAverageColors(albumCover).then((colors) => {
          console.log(colors);

          const colorsStops: GradientColorStop[] = [];
          const colorKeys = Object.keys(colors);
          for (const element of colorKeys) {
            // If the color key contains vibrant then we add it to the color stops
            if (element.toLowerCase().includes("vibrant")) {
              const color = colors[element] as any;
              colorsStops.push(color.hex);
            }
          }

          const gradient: GradientOptions = {
            bgColor: "#000",
            colorStops: colorsStops
          };
          this.visualizerComponent.registerGradient("Spotify", gradient);
          this.visualizerOptions.gradient = "Spotify";
          this.visualizerOptions.gradientLeft = "Spotify";
          this.visualizerOptions.gradientRight = "Spotify";
          this.applySettings();
          console.log(colorsStops.slice(0, 3));
          this.store.dispatch(colorChange(colorsStops.slice(0, 3) as string[], true));
        });
      }
    }
  }
}
