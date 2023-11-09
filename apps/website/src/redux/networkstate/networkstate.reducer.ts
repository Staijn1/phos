import {INetworkState} from '@angulon/interfaces';
import {NetworkstateAction} from './networkstate.action';

const initialState: INetworkState = {
  rooms: [{
    name: 'Room 1',
    connectedDevices: [
      {
        name: 'Device 1',
        state: {
          brightness: 0,
          colors: [],
          mode: 0,
          speed: 0,
          fftValue: 0
        },
        ipAddress: '17.1'
      }
    ]
  }]
};

export const networkStateReducer = (state: INetworkState = initialState, action: any): INetworkState => {
  switch (action.type) {
    case NetworkstateAction.LOAD_NETWORK_STATE:
      return action.payload;
    default:
      return state;
  }
};
