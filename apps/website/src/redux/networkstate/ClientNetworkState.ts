import {INetworkState, IRoom} from '@angulon/interfaces';

/**
 * Type to extend the INetworkState interface which allows for an additional properties to be added that only live on each client
 */
export interface ClientNetworkState extends INetworkState {
  selectedRooms: IRoom[];
}
