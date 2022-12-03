import {Injectable} from '@angular/core'
import {GeneralSettings} from '../../shared/types/types'
import {Options} from 'audiomotion-analyzer'
import iro from '@jaames/iro'
import {MessageService} from '../error/message.service';


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
  private readonly defaultGeneralSettings: GeneralSettings = {
    chroma: false,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    initialColor: false,
    theme: 'default'
  };

  constructor(private readonly messageService: MessageService) {
    this.setDefaults()
  }

  saveVisualizerOptions(options: Options): void {
    delete options.onCanvasDraw
    this.saveSettings(options, 'visualizerSettings')
  }

  readVisualizerOptions(): Options {
    return this.readSettings('visualizerSettings') as Options
  }

  saveGeneralSettings(settings: GeneralSettings): void {
    this.saveSettings(settings, 'generalSettings')
  }

  readGeneralSettings(): GeneralSettings {
    return this.readSettings('generalSettings') as GeneralSettings
  }

  convertColors(colors: iro.Color[]): string[] {
    const convertedColors: string[] = []
    for (const item of colors) {
      convertedColors.push(item.hexString)
    }
    return convertedColors
  }

  private readSettings(name: 'generalSettings' | 'visualizerSettings'): GeneralSettings | Options {
    const savedItem = localStorage.getItem(name)
    try {
      return JSON.parse(savedItem as string)
    } catch (e: any) {
      this.messageService.setMessage(e)
      switch (name) {
        case 'generalSettings':
          return this.defaultGeneralSettings
        case 'visualizerSettings':
          return this.defaultVisualizerOptions
      }
    }
  }

  private saveSettings(settings: any, name: 'generalSettings' | 'visualizerSettings'): void {
    localStorage.setItem(name, JSON.stringify(settings))
  }

  /**
   * Sets the default settings if no settings are saved
   * @private
   */
  private setDefaults(force?: boolean): void {
    if (!this.readSettings('generalSettings') || force) {
      this.saveGeneralSettings(this.defaultGeneralSettings)
    }
    if (!this.readSettings('visualizerSettings') || force) {
      this.saveVisualizerOptions(this.defaultVisualizerOptions)
    }
  }

  clearSettings() {
    this.setDefaults(true)
    location.reload()
  }
}
