import { UserPreferences } from '../../app/shared/types/types';
import { UserPreferencesAction } from './user-preferences.action';
import { loadObjectFromLocalStorage } from '../../app/shared/functions';

const defaultUserPreferences: UserPreferences = {
  settings: {
    chromaSupportEnabled: false,
    theme: 'default',
  },
  visualizerOptions: {
    barSpace: 0.1,
    bgAlpha: 0.7,
    fftSize: 8192,
    fillAlpha: 1,
    gradientLeft: 'classic',
    lineWidth: 0,
    loRes: false,
    lumiBars: false,
    maxDecibels: -25,
    maxFreq: 22000,
    minDecibels: -85,
    minFreq: 20,
    mode: 0,
    overlay: false,
    radial: false,
    reflexAlpha: 1,
    reflexBright: 1,
    reflexFit: true,
    reflexRatio: 0.5,
    showBgColor: true,
    showFPS: false,
    linearAmplitude: false,
    linearBoost: 1,
    ledBars: false,
    showPeaks: false,
    showScaleX: false,
    showScaleY: false,
    smoothing: 0.7,
    spinSpeed: 0,
    weightingFilter: '',
    energyPreset: 'bass'
  }
};

const initialState: UserPreferences = loadObjectFromLocalStorage('userPreferences', defaultUserPreferences);

export const userPreferencesReducer = (state: UserPreferences = initialState, action: any): UserPreferences => {
  switch (action.type) {
    case UserPreferencesAction.CHANGE_VISUALIZER_OPTIONS: {
      return {
        ...state,
        visualizerOptions: {
          ...state.visualizerOptions,
          ...action.payload
        }
      };
    }
    case UserPreferencesAction.CHANGE_GENERAL_SETTINGS : {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    }
    case UserPreferencesAction.SET_DEFAULT_USER_PREFERENCES: {
      return defaultUserPreferences;
    }
    default:
      return state;
  }
};
