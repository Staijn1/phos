export class GlobalVars {
  public static NUM_LEDS = 30;
  public static rand16seed = 1337;
}

export type Theme = string;

export const themes: Theme[] = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

export const visualizerModeId = 72;

export const SPEED_MAXIMUM_INTERVAL_MS = 10000;
export const SPEED_MINIMUM_INTERVAL_MS = 200;
export const MINIMUM_BRIGHTNESS = 10;
export const MAXIMUM_BRIGHTNESS = 255;
