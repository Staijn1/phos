import {LedstripState} from './LedstripState';
import {ObjectId} from 'typeorm';

export interface INetworkState {
  rooms: IRoom[],
  devices: IDevice[]
}

export interface IRoom {
  id: ObjectId;
  name: string;
  connectedDevices: IDevice[]
}

export interface IDevice {
  id: ObjectId;
  name: string;
  state: LedstripState;
  isLedstrip: boolean;
  isConnected:boolean;
  room: IRoom;
}
