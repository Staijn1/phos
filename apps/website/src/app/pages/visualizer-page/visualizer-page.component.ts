import { Component, OnDestroy, ViewChild } from '@angular/core';
import AudioMotionAnalyzer, { GradientColorStop, GradientOptions } from 'audiomotion-analyzer';
import { faCheck, faExpand, faLightbulb, faList, faSliders, faWrench } from '@fortawesome/free-solid-svg-icons';
import { ChromaEffectService } from '../../services/chromaEffect/chroma-effect.service';
import { SettingsService } from '../../services/settings/settings.service';
import { VisualizerComponent } from '../../shared/components/visualizer/visualizer.component';
import { AngulonVisualizerOptions, GradientInformationExtended, LedstripState } from '@angulon/interfaces';
import { OffCanvasComponent } from '../../shared/components/offcanvas/off-canvas.component';
import * as slider from '@angular-slider/ngx-slider';
import { InformationService } from '../../services/information-service/information.service';
import { visualizerModeId } from '../../shared/constants';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { Store } from '@ngrx/store';
import { ChangeLedstripColors, ChangeLedstripMode } from '../../../redux/ledstrip/ledstrip.action';
import { WebsocketServiceNextGen } from '../../services/websocketconnection/websocket-nextgen.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer-page.component.html',
  styleUrls: ['./visualizer-page.component.scss']
})
export class VisualizerPageComponent implements OnDestroy {
  @ViewChild(VisualizerComponent) visualizerComponent!: VisualizerComponent;
  @ViewChild(OffCanvasComponent) offcanvas!: OffCanvasComponent;
  visualizerOptions: AngulonVisualizerOptions = {};

  // Gradient definitions
  gradients: GradientInformationExtended[] = [];
  // Visualization modes
  modes = [
    { value: 0, text: 'Discrete frequencies', disabled: false },
    { value: 1, text: '1/24th octave bands', disabled: false },
    { value: 2, text: '1/12th octave bands', disabled: false },
    { value: 3, text: '1/8th octave bands', disabled: false },
    { value: 4, text: '1/6th octave bands', disabled: false },
    { value: 5, text: '1/4th octave bands', disabled: false },
    { value: 6, text: '1/3rd octave bands', disabled: false },
    { value: 7, text: 'Half octave bands', disabled: false },
    { value: 8, text: 'Full octave bands', disabled: false },
    { value: 10, text: 'Area graph', disabled: false }
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
    private connection: WebsocketServiceNextGen,
    private information: InformationService,
    private settingsService: SettingsService,
    private chromaEffect: ChromaEffectService,
    private store: Store<{ ledstripState: LedstripState | undefined }>
  ) {
  }

  /**
   * For the current selected mode, find the corresponding mode object
   * If the name of the mode includes octave then return true
   */
  get isOctaveBandMode() {
    const currentMode = this.visualizerOptions.mode;
    const mode = this.modes.find((mode) => mode.value === currentMode);
    return mode?.text.includes('octave');
  }

  ngOnDestroy(): void {
    this.gradients = [];
    this.wakeLock?.release()
      .then()
      .catch((error: any) => console.error('Failed to release wake lock', error));
  }

  updateLedstrip(): void {
    this.store.dispatch(new ChangeLedstripMode(visualizerModeId));
  }

  drawCallback(instance: AudioMotionAnalyzer): void {
    const value = instance.getEnergy(this.visualizerOptions.energyPreset);
    this.connection.sendFFTValue(value);
    this.chromaEffect.intensity = value;
  }

  fullscreen(): void {
    this.visualizerComponent.toggleFullscreen();
  }

  init(): void {
    this.connection.getGradients().then((gradients) => {
      this.gradients = gradients;
    }).catch(e => {
      this.readSettings();
      this.applySettings();
    });

    if ('wakeLock' in navigator) {
      const anyNavigator = navigator as any;
      anyNavigator.wakeLock.request('screen').then((lock: any) => {
        this.wakeLock = lock;
      }).catch((error: any) => {
        console.error('Failed to request wake lock', error);
      });
    }
  }

  readSettings() {
    const settings = this.settingsService.readVisualizerOptions();
    settings.onCanvasDraw = this.drawCallback.bind(this);
    if (settings.gradientRight === 'Spotify' || settings.gradientLeft === 'Spotify' || settings.gradient === 'Spotify') {
      settings.gradient = 'prism';
      settings.gradientLeft = 'prism';
      settings.gradientRight = 'prism';
    }
    this.visualizerOptions = settings;
  }

  toggleSettingsWindow() {
    this.offcanvas.toggle();
  }

  applySettings() {
    this.visualizerOptions = Object.assign({}, this.visualizerOptions);
    this.settingsService.saveVisualizerOptions(this.visualizerOptions);
  }

  closeOffcanvas() {
    this.offcanvas.close();
  }

  /**
   * Fired when the spotify player state changes
   * This handler checks if the song has changed and if so, it will extract the average colors from the album cover
   * Then it creates a gradient from the colors and sets it as the current gradient in the visualizer
   * Then it will send the average colors to the ledstrip
   * @param {Spotify.PlaybackState} state
   */
  onSpotifyStateChanged(state: Spotify.PlaybackState) {
    if (state?.track_window?.current_track?.id !== this.currentTrackId) {
      this.currentTrackId = state?.track_window?.current_track?.id;
      const albumCover = state?.track_window?.current_track?.album?.images[0]?.url;
      if (albumCover) {
        this.information.getColorsFromImageUrl(albumCover).then((colors) => {
          const primaryColor = colors.Average.hex;
          const secondaryColor = colors.Vibrant?.hex ?? '#000';
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
            bgColor: '#000',
            colorStops: colorsStops
          };
          this.visualizerComponent.registerGradient('Spotify', gradient);
          this.visualizerOptions.gradient = 'Spotify';
          this.visualizerOptions.gradientLeft = 'Spotify';
          this.visualizerOptions.gradientRight = 'Spotify';
          this.applySettings();
          this.store.dispatch(new ChangeLedstripColors([primaryColor, secondaryColor]));
        });
      }
    }
  }
}
