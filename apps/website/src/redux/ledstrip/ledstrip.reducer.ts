import { LedstripAction } from "./ledstrip.action";
import { ClientSideLedstripState, constrain, mergeArrays } from "@angulon/interfaces";
import {
  INITIAL_CLIENT_LEDSTRIP_STATE,
  MAXIMUM_BRIGHTNESS,
  MINIMUM_BRIGHTNESS,
  SPEED_MAXIMUM_INTERVAL_MS,
  SPEED_MINIMUM_INTERVAL_MS
} from "../../app/shared/constants";
import iro from "@jaames/iro";

export const ledstripStateReducer = (state: ClientSideLedstripState = INITIAL_CLIENT_LEDSTRIP_STATE, action: any): ClientSideLedstripState | undefined => {
  switch (action.type) {
    case LedstripAction.RECEIVE_SERVER_STATE: {
      // Convert the colors from hex to iro.Color
      const iroColors = action.payload.colors.map((color: string) => new iro.Color(color));
      return {
        ...action.payload,
        colors: iroColors
      };
    }
    case LedstripAction.INCREASE_BRIGHTNESS: {
      return {
        ...state,
        brightness: constrain(state.brightness * 1.1, MINIMUM_BRIGHTNESS, MAXIMUM_BRIGHTNESS)
      };
    }
    case LedstripAction.DECREASE_BRIGHTNESS: {
      return {
        ...state,
        brightness: constrain(state.brightness * 0.9, MINIMUM_BRIGHTNESS, MAXIMUM_BRIGHTNESS)
      };
    }
    case LedstripAction.CHANGE_COLORS: {
      return {
        ...state,
        colors: mergeArrays(state.colors, action.payload)
      };
    }
    case LedstripAction.CHANGE_MODE: {
      return {
        ...state,
        mode: action.payload
      };
    }
    case LedstripAction.INCREASE_SPEED: {
      return {
        ...state,
        speed: constrain(state.speed * 0.9, SPEED_MINIMUM_INTERVAL_MS, SPEED_MAXIMUM_INTERVAL_MS)
      };
    }
    case LedstripAction.DECREASE_SPEED: {
      return {
        ...state,
        speed: constrain(state.speed * 1.1, SPEED_MINIMUM_INTERVAL_MS, SPEED_MAXIMUM_INTERVAL_MS)
      };
    }
    case LedstripAction.MULTIPLE_PROPERTIES: {
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
