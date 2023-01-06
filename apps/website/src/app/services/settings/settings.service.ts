import { Injectable } from "@angular/core";
import { GeneralSettings } from "../../shared/types/types";
import { Options } from "audiomotion-analyzer";
import iro from "@jaames/iro";
import { MessageService } from "../error/message.service";
import { AngulonVisualizerOptions } from "@angulon/interfaces";


@Injectable({
  providedIn: "root"
})
export class SettingsService {
  readonly defaultVisualizerOptions: AngulonVisualizerOptions = {
    barSpace: 0.1,
    bgAlpha: 0.7,
    fftSize: 8192,
    fillAlpha: 1,
    gradient: "classic",
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
    weightingFilter: "",
    energyPreset: "bass"
  };
  private readonly defaultGeneralSettings: GeneralSettings = {
    chroma: false,
    colors: ["#ff0000", "#00ff00", "#0000ff"],
    initialColor: false,
    theme: "default"
  };

  constructor(private readonly messageService: MessageService) {
    this.setDefaults();
  }

  saveVisualizerOptions(options: Options): void {
    delete options.onCanvasDraw;
    this.saveSettings(options, "visualizerSettings");
  }

  readVisualizerOptions(): AngulonVisualizerOptions {
    return this.readSettings("visualizerSettings") as AngulonVisualizerOptions;
  }

  saveGeneralSettings(settings: GeneralSettings): void {
    this.saveSettings(settings, "generalSettings");
  }

  readGeneralSettings(): GeneralSettings {
    return this.readSettings("generalSettings") as GeneralSettings;
  }

  convertColors(colors: iro.Color[]): string[] {
    const convertedColors: string[] = [];
    for (const item of colors) {
      convertedColors.push(item.hexString);
    }
    return convertedColors;
  }

  clearSettings() {
    this.setDefaults(true);
    location.reload();
  }

  private readSettings(name: "generalSettings" | "visualizerSettings"): GeneralSettings | Options {
    const savedItem = localStorage.getItem(name);
    let defaultVal;
    switch (name) {
      case "generalSettings":
        defaultVal = this.defaultGeneralSettings;
        break;
      case "visualizerSettings":
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

  private saveSettings(settings: any, name: "generalSettings" | "visualizerSettings"): void {
    localStorage.setItem(name, JSON.stringify(settings));
  }

  /**
   * Sets the default settings if no settings are saved
   * @private
   */
  private setDefaults(force?: boolean): void {
    if (!this.readSettings("generalSettings") || force) {
      this.saveGeneralSettings(this.defaultGeneralSettings);
    }
    if (!this.readSettings("visualizerSettings") || force) {
      this.saveVisualizerOptions(this.defaultVisualizerOptions);
    }
  }
}
