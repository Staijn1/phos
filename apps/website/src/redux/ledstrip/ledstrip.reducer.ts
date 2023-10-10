import { LedstripAction } from './ledstrip.action';
import { constrain, INITIAL_LEDSTRIP_STATE, LedstripState, mergeArrays } from "@angulon/interfaces";
import {
  MAXIMUM_BRIGHTNESS,
  MINIMUM_BRIGHTNESS,
  SPEED_MAXIMUM_INTERVAL_MS,
  SPEED_MINIMUM_INTERVAL_MS
} from "../../app/shared/constants";

export const ledstripStateReducer = (state: LedstripState = INITIAL_LEDSTRIP_STATE, action: any): LedstripState | undefined => {
  switch (action.type) {
    case LedstripAction.RECEIVE_STATE: {
      return action.payload;
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
