import {LedstripState} from "../lib/LedstripState";

export interface NetworkState {
  rooms: Room[]
}

export interface Room {
  connectedDevices: Device[]
}

export type Device = LedstripState;
