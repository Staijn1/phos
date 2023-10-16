import { ClientSideLedstripState, INITIAL_LEDSTRIP_STATE } from "@angulon/interfaces";
import iro from "@jaames/iro";

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

export const INITIAL_CLIENT_LEDSTRIP_STATE: ClientSideLedstripState = {
  ...INITIAL_LEDSTRIP_STATE,
  colors: INITIAL_LEDSTRIP_STATE.colors.map(color => new iro.Color(color))
};
