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
 * So this type excludes the colors property from LedstripState and replaces it with an array of iro.Colors, which are transformed back and forth when communicating with the server
 */
export type ClientSideLedstripState = Omit<LedstripState, "colors"> & {
  colors: iro.Color[]
}
