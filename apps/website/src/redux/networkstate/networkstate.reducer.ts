import {INetworkState} from '@angulon/interfaces';
import {NetworkstateAction} from './networkstate.action';

const initialState: INetworkState = {
  rooms: [],
  devices: [],
};

export const networkStateReducer = (state: INetworkState = initialState, action: any): INetworkState => {
  switch (action.type) {
    case NetworkstateAction.LOAD_NETWORK_STATE:
      return action.payload;
    default:
      return state;
  }
};
