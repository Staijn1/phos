import { Options } from 'audiomotion-analyzer';


export interface AngulonVisualizerOptions extends Omit<Options, "gradient"> {
  energyPreset?: 'peak' | 'bass' | 'lowMid' | 'mid' | 'highMid' | 'treble';
}


export type GeneralSettings = {
  chromaSupportEnabled: boolean;
  theme: string;
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
