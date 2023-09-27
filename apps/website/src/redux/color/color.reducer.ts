export interface ColorpickerState {
  colors: string[];
  updateLedstrips: boolean;
}

const initialState: ColorpickerState = {
  colors: ['#ff0000', '#00ff00', '#0000ff'],
  updateLedstrips: true
};


export function colorpickerReducer(state = initialState, action: any): ColorpickerState {
  switch (action.type) {
    case 'COLOR_CHANGE': {
      // merge the state.colors with the action.payload
      const newColors = state.colors.map((color, index) => {
        if (action.payload[index]) {
          return action.payload[index];
        } else {
          return color;
        }
      });
      return {
        ...state,
        colors: newColors,
        updateLedstrips: action.updateLedstrips
      };
    }
    default:
      return state;
  }
}
