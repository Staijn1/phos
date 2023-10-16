import iro from "@jaames/iro";

export type LedstripState = {
  mode: number;
  colors: string[];
  brightness: number;
  speed: number;
  fftValue: number;
}

/**
 * To be able to do some more advanced stuff with colors we require the colors to be iro.Colors instead of hex strings
 * Luckily, iro.Color accepts hex strings in its constructor and can return a hex string with the hexString property
 */
export type ClientSideLedstripState = Omit<LedstripState, "colors"> & {
  colors: iro.Color[]
}
