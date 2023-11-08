import {LedstripState} from './LedstripState';

export interface INetworkState {
  rooms: IRoom[]
}

export interface IRoom {
  name: string;
  connectedDevices: IDevice[]
}

export interface IDevice {
  name: string;
  ipAddress: string;
  state: LedstripState;
}
