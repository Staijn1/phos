import {Options} from "audiomotion-analyzer";

export interface AngulonVisualizerOptions extends Options {
  energyPreset?: "peak" | "bass" | "lowMid" | "mid" | "highMid" | "treble";
}
