import { Options } from 'audiomotion-analyzer';


export interface AngulonVisualizerOptions extends Options {
  energyPreset?: "peak" | "bass" | "lowMid" | "mid" | "highMid" | "treble";
}


export type GeneralSettings = {
  chroma: boolean;
  theme: string;
  darkmodeEnabled: boolean
};

export type RGBObject = {
  r?: number;
  g?: number;
  b?: number;
}


export type UserPreferences = {
  settings: GeneralSettings,
  visualizerOptions: AngulonVisualizerOptions
}
