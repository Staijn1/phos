import {RoomState} from './RoomState';

export interface INetworkState {
  rooms: IRoom[],
  devices: IDevice[]
}

export interface IRoom {
  id: string;
  name: string;
  connectedDevices: IDevice[]
  state: RoomState;
}

export interface IDevice {
  id: string;
  name: string;
  isLedstrip: boolean;
  isConnected:boolean;
  room: IRoom | null;
}
