import {NetworkstateAction} from './networkstate.action';
import {ClientNetworkState, WebsocketConnectionStatus} from './ClientNetworkState';
import {loadObjectFromLocalStorage} from '../../app/shared/functions';
import {IRoom} from '@angulon/interfaces';

// Our initial state is mostly empty, but the selectedRooms are stored in the local storage, so we can keep the state when the user refreshes the page.
// However, when we receive the network state from the server, we should check if the selected rooms still exist and if not, automatically unselect them.

const selectedRoomsFromLocalStorage = loadObjectFromLocalStorage('selectedRooms', []);

const initialState: ClientNetworkState = {
  rooms: [],
  devices: [],
  selectedRooms: selectedRoomsFromLocalStorage,
  connectionStatus: WebsocketConnectionStatus.DISCONNECTED
};

export const networkStateReducer = (state: ClientNetworkState = initialState, action: any): ClientNetworkState => {
  switch (action.type) {
    // Merge the incoming network state from the server with the current state, so we do not lose our client-side state.
    // Also, we should check if the selected rooms still exist and if not, automatically unselect them.
    case NetworkstateAction.LOAD_NETWORK_STATE: {
      const newSelectedRooms = state.selectedRooms.filter(selectedRoom => action.payload.rooms.some((room: IRoom) => room.id === selectedRoom.id));
      localStorage.setItem('selectedRooms', JSON.stringify(newSelectedRooms));

      return {
        ...state,
        ...action.payload,
        selectedRooms: newSelectedRooms
      };
    }
    case NetworkstateAction.SELECT_ROOM: {
      const newSelectedRooms = [...state.selectedRooms, action.payload];
      localStorage.setItem('selectedRooms', JSON.stringify(newSelectedRooms));
      return {
        ...state,
        selectedRooms: newSelectedRooms
      };
    }
    case NetworkstateAction.UNSELECT_ROOM: {
      const newSelectedRooms = state.selectedRooms.filter(room => room.id !== action.payload.id);
      localStorage.setItem('selectedRooms', JSON.stringify(newSelectedRooms));
      return {
        ...state,
        selectedRooms: newSelectedRooms
      };
    }
    case NetworkstateAction.NETWORKCONNECTIONSTATUSCHANGE: {
      return {
        ...state,
        connectionStatus: action.payload
      };
    }
    default:
      return state;
  }
};
