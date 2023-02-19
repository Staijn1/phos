import iro from "@jaames/iro";

export interface ColorpickerState {
  colors: string[];
  updateLedstrips: boolean;
}

const initialState: ColorpickerState = {
  colors: ["#ff0000", "#00ff00", "#0000ff"],
  updateLedstrips: true,
};

export function colorpickerReducer(state = initialState, action: any): ColorpickerState {
  switch (action.type) {
    case 'COLOR_CHANGE':
      return {
        ...state,
        colors: action.payload,
        updateLedstrips: action.updateLedstrips
      };
    default:
      return state;
  }
}
