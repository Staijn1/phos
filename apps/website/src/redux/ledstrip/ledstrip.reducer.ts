import { LedstripAction } from './ledstrip.action';
import { constrain, LedstripState, mergeArrays } from '@angulon/interfaces';

export const ledstripStateReducer = (state: LedstripState | undefined, action: any): LedstripState | undefined => {
  if (!state && ![LedstripAction.RECEIVE_STATE, '@ngrx/store/init'].includes(action.type)) {
    throw new Error(`Ledstrip state must first be fetched from the server before manipulation can be done. Received action: ${action.type}`);
  }
  state = state as LedstripState;

  switch (action.type) {
    case LedstripAction.RECEIVE_STATE: {
      return action.payload;
    }
    case LedstripAction.INCREASE_BRIGHTNESS: {
      return {
        ...state,
        brightness: constrain(state.brightness * 1.1, 10, 255)
      };
    }
    case LedstripAction.DECREASE_BRIGHTNESS: {
      return {
        ...state,
        brightness: constrain(state.brightness * 0.9, 10, 255)
      };
    }
    case LedstripAction.CHANGE_COLORS: {
      console.log("Changing colors", state.colors, action.payload);
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
        speed: constrain(state.speed * 0.9, 200, 10000)
      };
    }
    case LedstripAction.DECREASE_SPEED: {
      return {
        ...state,
        speed: constrain(state.speed * 1.1, 200, 10000)
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
