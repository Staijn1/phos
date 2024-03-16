import iro from "@jaames/iro";
import { IDevice } from "./INetworkState";

export type LedstripState = {
  mode: number;
  colors: string[];
  brightness: number;
  speed: number;
  fftValue: number;
}

/**
 * Room state is kept in the API and is used to keep track of the state of each room and each device in that room
 * It is a Map where:
 * - the key of the map is the room ID
 * - The value is the ledstrip state that is applied to all devices in that room
 */
export type RoomState = Map<string, LedstripState>

/**
 * To be able to do some more advanced stuff with colors we require the colors to be iro.Colors instead of hex strings
 * Luckily, iro.Color accepts hex strings in its constructor and can return a hex string with the hexString property
 * So this type excludes the colors property from LedstripState and replaces it with an array of iro.Colors, which are transformed back and forth when communicating with the server
 */
export type ClientSideLedstripState = Omit<LedstripState, "colors"> & {
  colors: iro.Color[]
}
