import iro from "@jaames/iro";

export interface ColorpickerState {
  colors: iro.Color[];
}

const initialState: ColorpickerState = {
  colors: [new iro.Color({r: 255, g: 0, b: 0, a: 1}), new iro.Color({r: 0, g: 0, b: 255, a: 1}), new iro.Color({r: 0, g: 255, b: 0, a: 1})],
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
