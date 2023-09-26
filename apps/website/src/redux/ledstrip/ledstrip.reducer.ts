import { LedstripAction } from "./ledstrip.action";
import { LedstripState } from "@angulon/interfaces";

const initialState: LedstripState = {
  colors: [],
  brightness: 0,
  mode: 0,
  speed: 0,
  fftValue: 0
};

export const ledstripStateReducer = (state = initialState, action: any): LedstripState => {
  switch (action.type) {
    case LedstripAction.RECEIVE_STATE: {
      return state;
    }
    case LedstripAction.CHANGE_BRIGHTNESS: {
      return {
        ...state,
        brightness: action.payload
      };
    }
    case LedstripAction.CHANGE_COLORS: {
      return {
        ...state,
        colors: action.payload
      };
    }
    case LedstripAction.CHANGE_MODE: {
      return {
        ...state,
        mode: action.payload
      };
    }
    case LedstripAction.CHANGE_SPEED: {
      return {
        ...state,
        speed: action.payload
      };
    }
    // Don't include fftValue in the state because:
    // 1. It's not used in the UI
    // 2. Its value is updated a lot when the visualizer is running, causing many subcriptions to be called
    default:
      return state;
  }
};
