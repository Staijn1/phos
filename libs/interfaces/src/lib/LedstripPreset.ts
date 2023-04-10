export interface LedstripPreset {
  name: string;
  brightness: number;
  segments: Segment[];
}

export interface Segment {
  start: number;
  stop: number;
  mode: number;
  speed: number;
  options: number;
  colors: string[];
}
