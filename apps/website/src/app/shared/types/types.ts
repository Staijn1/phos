import { Options } from 'audiomotion-analyzer';


export interface AngulonVisualizerOptions extends Omit<Options, "gradient"> {
  energyPreset?: 'peak' | 'bass' | 'lowMid' | 'mid' | 'highMid' | 'treble';
}


export type GeneralSettings = {
  chromaSupportEnabled: boolean;
  theme: string;
  deviceName: string;
  disableSecondaryColorSpotify: boolean; // This setting disables the secondary color based on the album cover colors when using Spotify Integration
};

export type RGBObject = {
  r?: number;
  g?: number;
  b?: number;
}

export type UserPreferences = {
  settings: GeneralSettings,
  visualizerOptions: AngulonVisualizerOptions,
}
