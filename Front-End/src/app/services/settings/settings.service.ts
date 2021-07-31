import {Injectable} from '@angular/core'
import {GeneralSettings} from '../../shared/types/types'
import {Options} from 'audiomotion-analyzer'
import iro from '@jaames/iro'


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly defaultVisualizerOptions: Options = {
    barSpace: 0.1,
    bgAlpha: 0.7,
    fftSize: 8192,
    fillAlpha: 1,
    gradient: 'classic',
    lineWidth: 0,
    loRes: false,
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

  private readonly defaultGeneralSettings: GeneralSettings = {chroma: false, colors: ['#ff0000', '#00ff00', '#0000ff'], initialColor: false};

  saveVisualizerOptions(options: Options): void {
    delete options.onCanvasDraw
    this.saveSettings(options, 'visualizerSettings')
  }

  readVisualizerOptions(): Options {
    return this.readSettings('visualizerSettings')
  }

  convertColors(colors: iro.Color[]): string[] {
    const convertedColors: string[] = []
    for (const item of colors) {
      convertedColors.push(item.hexString)
    }
    return convertedColors
  }

  saveGeneralSettings(settings: GeneralSettings): void {
    this.saveSettings(settings, 'generalSettings')
  }

  readGeneralSettings(): GeneralSettings {
    return this.readSettings('generalSettings')
  }

  readSettings(name: string): any {
    const savedItem = localStorage.getItem(name)
    if (savedItem) {
      return JSON.parse(savedItem)
    } else {
      this.setDefaults()
      return undefined
    }
  }

  saveSettings(settings: any, name: 'generalSettings' | 'visualizerSettings'): void {
    localStorage.setItem(name, JSON.stringify(settings))
  }

  private setDefaults(): void {
    this.saveSettings(this.defaultGeneralSettings, 'generalSettings')
    this.saveSettings(this.defaultVisualizerOptions, 'visualizerSettings')
  }
}
