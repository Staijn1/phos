import {LedstripState} from './LedstripState';

export interface INetworkState {
  rooms: IRoom[]
}

export interface IRoom {
  connectedDevices: IDevice[]
}

export interface IDevice {
  name: string;
  state: LedstripState;
}
