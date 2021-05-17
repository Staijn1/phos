import {Injectable} from '@angular/core';
import {GeneralSettings, iroColorObject} from '../../types/types';
import {ElectronService} from '../electron/electron.service';
import ini from 'ini';
import {environment} from '../../../environments/environment';

interface AllSettings {
  visualizer: {
    barSpace: number;
    bgAlpha: number;
    fftSize: number;
    fillAlpha: number;
    gradient: string;
    lineWidth: number;
    loRes: boolean;
    lumiBars: boolean;
    maxDecibels: number;
    maxFreq: number;
    minDecibels: number;
    minFreq: number;
    mode: number;
    overlay: boolean;
    radial: boolean;
    reflexAlpha: number;
    reflexBright: number;
    reflexFit: boolean;
    showBgColor: boolean;
    showFPS: boolean;
    showLeds: boolean;
    showPeaks: boolean;
    showScaleX: false;
    showScaleY: false;
    smoothing: number;
    spinSpeed: number;
  };
  general: {
    com: string;
    colors: string[]
    leds: number;
    chroma: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  fs: any;
  private readonly fileUrl: string;

  constructor(private electronService: ElectronService) {
    if (!this.electronService.isElectron()) {
      return;
    }
    this.fs = electronService.fs;

    let root = process.resourcesPath;
    let pathToSettings;

    if (root.includes('node_modules')) {
      root = root.split('node_modules')[0];
      pathToSettings = 'src/assets/settings.ini';
    } else {
      pathToSettings = '/app/src/assets/settings.ini';
    }


    this.fileUrl = root + pathToSettings;
  }

  saveVisualizerOptions(options: any): void {
    if (!this.electronService.isElectron()) {
      return;
    }

    delete options.onCanvasDraw;
    delete options.minDecibels;
    delete options.maxDecibels;
    this.saveSettings(options, this.readGeneralSettings());
  }

  readVisualizerOptions(): any {
    if (!this.electronService.isElectron()) {
      return;
    }

    const settings = this.readSettings().visualizer;
    if (settings !== undefined) {
      return settings;
    } else {
      return {
        barSpace: 0.1,
        bgAlpha: 0.7,
        fftSize: 8192,
        fillAlpha: 1,
        gradient: 'classic',
        lineWidth: 0,
        loRes: true,
        lumiBars: false,
        maxDecibels: -25,
        maxFreq: 22000,
        minDecibels: -85,
        minFreq: 20,
        mode: 0,
        overlay: false,
        radial: false,
        reflexAlpha: 1,
        reflexBright: 1,
        reflexFit: true,
        reflexRatio: 0.5,
        showBgColor: true,
        showFPS: false,
        showLeds: false,
        showPeaks: false,
        showScaleX: false,
        showScaleY: false,
        smoothing: 0.7,
        spinSpeed: 0,
      };
    }
  }

  saveGeneralSettings(colors: iroColorObject[] | undefined, selectedCom: string | undefined, numLeds: number | undefined, chroma: boolean | undefined): void {
    if (!this.electronService.isElectron()) {
      return;
    }

    const currentSettings = this.readGeneralSettings();
    if (colors) {
      for (let i = 0; i < colors.length; i++) {
        currentSettings.colors[i] = colors[i].hexString;
      }
    }

    currentSettings.chroma = (typeof chroma === 'undefined') ? currentSettings.chroma : chroma;
    this.saveSettings(this.readSettings().visualizer, currentSettings);
  }

  readGeneralSettings(): GeneralSettings {
    const settings = this.readSettings().general;
    if (settings !== undefined || !this.electronService.isElectron()) {
      return settings;
    } else {
      return {chroma: false, colors: ['#FFF', '#00FF00', '#FF0000']};
    }
  }

  readSettings(): AllSettings {
    if (!this.electronService.isElectron()) {
      return {
        general: {chroma: false, colors: [], com: '', leds: 0},
        visualizer: {
          barSpace: 0,
          bgAlpha: 0,
          fftSize: 0,
          fillAlpha: 0,
          gradient: '',
          lineWidth: 0,
          loRes: false,
          lumiBars: false,
          maxDecibels: 0,
          maxFreq: 0,
          minDecibels: 0,
          minFreq: 0,
          mode: 0,
          overlay: false,
          radial: false,
          reflexAlpha: 0,
          reflexBright: 0,
          reflexFit: false,
          showBgColor: false,
          showFPS: false,
          showLeds: false,
          showPeaks: false,
          showScaleX: false,
          showScaleY: false,
          smoothing: 0,
          spinSpeed: 0
        }
      };
    }

    return ini.parse(this.fs.readFileSync(this.fileUrl, 'utf-8'));
  }

  saveSettings(visualizerSection, generalSection): void {
    if (!this.electronService.isElectron()) {
      return;
    }

    const iniFiedVisualizerSection = ini.stringify(visualizerSection, {section: 'visualizer'});
    const iniFiedGeneralSection = ini.stringify(generalSection, {section: 'general'});

    if (environment.saveSettings) {
      this.fs.writeFileSync(this.fileUrl, `${iniFiedVisualizerSection}${iniFiedGeneralSection}`);
    }
  }
}
