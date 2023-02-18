import iro from "@jaames/iro";

export interface ColorpickerState {
  colors: string[];
}

const initialState: ColorpickerState = {
  colors: ["#ff0000", "#00ff00", "#0000ff"]
};

export function colorpickerReducer(state = initialState, action: any): ColorpickerState {
  switch (action.type) {
    case 'COLOR_CHANGE':
      return {
        ...state,
        colors: action.payload
      };
    default:
      return state;
  }
}
