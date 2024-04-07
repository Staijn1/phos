import { RoomStateAction } from "./roomstate.action";
import { ClientSideRoomState, constrain, mergeArrays } from "@angulon/interfaces";
import {
  INITIAL_CLIENT_LEDSTRIP_STATE,
  MAXIMUM_BRIGHTNESS,
  MINIMUM_BRIGHTNESS,
  SPEED_MAXIMUM_INTERVAL_MS,
  SPEED_MINIMUM_INTERVAL_MS
} from "../../app/shared/constants";
import iro from "@jaames/iro";

/**
 * Reducer used to update the room state on the server.
 * We also receive a server state here, but it is the state of the room that was changed by the server.
 * This is not necessarily the same as using the network state reducer to find the current state of selected rooms,
 * as a room can be changed by another device, and the current device does not have the changed room selected
 * @param state
 * @param action
 */
export const roomStateReducer = (state: ClientSideRoomState = INITIAL_CLIENT_LEDSTRIP_STATE, action: any): ClientSideRoomState | undefined => {
  switch (action.type) {
    case RoomStateAction.RECEIVE_SERVER_STATE: {
      // Convert the colors from hex to iro.Color
      const iroColors = action.payload.colors.map((color: string) => new iro.Color(color));
      return {
        ...action.payload,
        colors: iroColors
      };
    }
    case RoomStateAction.INCREASE_BRIGHTNESS: {
      return {
        ...state,
        brightness: constrain(state.brightness * 1.1, MINIMUM_BRIGHTNESS, MAXIMUM_BRIGHTNESS)
      };
    }
    case RoomStateAction.DECREASE_BRIGHTNESS: {
      return {
        ...state,
        brightness: constrain(state.brightness * 0.9, MINIMUM_BRIGHTNESS, MAXIMUM_BRIGHTNESS)
      };
    }
    case RoomStateAction.CHANGE_COLORS: {
      return {
        ...state,
        colors: mergeArrays(state.colors, action.payload)
      };
    }
    case RoomStateAction.CHANGE_MODE: {
      return {
        ...state,
        mode: action.payload
      };
    }
    case RoomStateAction.INCREASE_SPEED: {
      return {
        ...state,
        speed: constrain(state.speed * 0.9, SPEED_MINIMUM_INTERVAL_MS, SPEED_MAXIMUM_INTERVAL_MS)
      };
    }
    case RoomStateAction.DECREASE_SPEED: {
      return {
        ...state,
        speed: constrain(state.speed * 1.1, SPEED_MINIMUM_INTERVAL_MS, SPEED_MAXIMUM_INTERVAL_MS)
      };
    }
    case RoomStateAction.MULTIPLE_PROPERTIES: {
      return {
        ...state,
        ...action.payload,
        colors: mergeArrays(state.colors, action.payload.colors)
      };
    }
    // Don't include fftValue in the state because:
    // 1. It's not used in the UI
    // 2. Its value is updated a lot when the visualizer is running, causing many subcriptions to be called
    default:
      return state;
  }
};
