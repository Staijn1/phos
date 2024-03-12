import {NetworkstateAction} from './networkstate.action';
import {ClientNetworkState} from './ClientNetworkState';

const initialState: ClientNetworkState = {
  rooms: [],
  devices: [],
  selectedRooms: []
};

export const networkStateReducer = (state: ClientNetworkState = initialState, action: any): ClientNetworkState => {
  switch (action.type) {
    // Merge the incoming network state from the server with the current state so we do not lose our client-side state.
    case NetworkstateAction.LOAD_NETWORK_STATE:
      return {
        ...state,
        ...action.payload
      };
    case NetworkstateAction.SELECT_ROOM:
      return {
        ...state,
        selectedRooms: [...state.selectedRooms, action.payload]
      };
    case NetworkstateAction.UNSELECT_ROOM:
      return {
        ...state,
        selectedRooms: state.selectedRooms.filter(room => room.id !== action.payload.id)
      };
    default:
      return state;
  }
};
