import { UserPreferences } from "../../app/shared/types/types";
import { UserPreferencesAction } from "./user-preferences.action";
import { loadObjectFromLocalStorage } from "../../app/shared/functions";

const defaultUserPreferences: UserPreferences = {
  settings: {
    chromaSupportEnabled: false,
    theme: "dark",
    // A random device name
    deviceName: Math.random().toString(36).substring(7),
    disableSecondaryColorSpotify: false // P5817
  },
  visualizerOptions: {
    barSpace: 0.1,
    bgAlpha: 0.7,
    fftSize: 8192,
    fillAlpha: 1,
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
    weightingFilter: "",
    energyPreset: "bass"
  }
};

const initialState: UserPreferences = loadObjectFromLocalStorage("userPreferences", defaultUserPreferences);

if (initialState.visualizerOptions.gradientLeft === "spotify") {
  initialState.visualizerOptions.gradientLeft = "classic";
}

if (initialState.visualizerOptions.gradientRight === "spotify") {
  initialState.visualizerOptions.gradientRight = "classic";
}

export const userPreferencesReducer = (state: UserPreferences = initialState, action: any): UserPreferences => {
  switch (action.type) {
    case UserPreferencesAction.CHANGE_VISUALIZER_OPTIONS: {
      const newState = {
        ...state,
        visualizerOptions: {
          ...state.visualizerOptions,
          ...action.payload
        }
      };

      localStorage.setItem("userPreferences", JSON.stringify(newState));
      return newState;
    }
    case UserPreferencesAction.CHANGE_GENERAL_SETTINGS : {
      const newState = {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

      localStorage.setItem("userPreferences", JSON.stringify(newState));
      return newState;
    }
    default:
      return state;
  }
};
