import {LedstripState} from './LedstripState';

export interface INetworkState {
  rooms: IRoom[],
  devices: IDevice[]
}

export interface IRoom {
  id: string;
  name: string;
  connectedDevices: IDevice[]
}

export interface IDevice {
  id: string;
  name: string;
  state: LedstripState;
  isLedstrip: boolean;
  isConnected:boolean;
}
