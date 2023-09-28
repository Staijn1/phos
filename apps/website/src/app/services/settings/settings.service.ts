import { Injectable } from '@angular/core';
import { AngulonVisualizerOptions, GeneralSettings } from '../../shared/types/types';
import { Options } from 'audiomotion-analyzer';
import { MessageService } from '../message-service/message.service';

/**
 * @deprecated Use redux instead
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly defaultVisualizerOptions: AngulonVisualizerOptions = {
    barSpace: 0.1,
    bgAlpha: 0.7,
    fftSize: 8192,
    fillAlpha: 1,
    gradientLeft: 'classic',
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
    linearAmplitude: false,
    linearBoost: 1,
    ledBars: false,
    showPeaks: false,
    showScaleX: false,
    showScaleY: false,
    smoothing: 0.7,
    spinSpeed: 0,
    weightingFilter: '',
    energyPreset: 'bass'
  };
  private readonly defaultGeneralSettings: GeneralSettings = {
    chromaSupportEnabled: false,
    theme: 'default',
    darkModeEnabled: false
  };

  constructor(private readonly messageService: MessageService) {
  }

  saveVisualizerOptions(options: Options): void {
    delete options.onCanvasDraw;
    this.saveSettings(options, 'visualizerSettings');
  }

  readVisualizerOptions(): AngulonVisualizerOptions {
    return this.readSettings('visualizerSettings') as AngulonVisualizerOptions;
  }

  saveGeneralSettings(settings: GeneralSettings): void {
    this.saveSettings(settings, 'generalSettings');
  }

  readGeneralSettings(): GeneralSettings {
    return this.readSettings('generalSettings') as GeneralSettings;
  }

  private readSettings(name: 'generalSettings' | 'visualizerSettings'): GeneralSettings | Options {
    const savedItem = localStorage.getItem(name);
    let defaultVal;
    switch (name) {
      case 'generalSettings':
        defaultVal = this.defaultGeneralSettings;
        break;
      case 'visualizerSettings':
        defaultVal = this.defaultVisualizerOptions;
        break;
    }

    try {
      const parsed = JSON.parse(savedItem as string);
      return { ...defaultVal, ...parsed };
    } catch (e: any) {
      this.messageService.setMessage(e);
      return defaultVal;
    }
  }

  private saveSettings(settings: any, name: 'generalSettings' | 'visualizerSettings'): void {
    localStorage.setItem(name, JSON.stringify(settings));
  }
}
