import {LedstripState} from './LedstripState';
import {ObjectId} from 'typeorm';

export interface INetworkState {
  rooms: IRoom[]
}

export interface IRoom {
  id: ObjectId;
  name: string;
  connectedDevices: IDevice[]
}

export interface IDevice {
  name: string;
  ipAddress: string;
  state: LedstripState;
  isLedstrip: boolean;
  isConnected:boolean;
  room: IRoom;
}
