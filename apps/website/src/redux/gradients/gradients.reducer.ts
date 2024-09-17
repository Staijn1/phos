import { GradientInformation } from "@angulon/interfaces";
import { GradientAction } from "./gradients.action";

const initialState: GradientInformation[] = [];

export const gradientsReducer = (state: GradientInformation[] = initialState, action: any): GradientInformation[] => {
  switch (action.type) {
    case GradientAction.LOAD_GRADIENTS:
      return action.payload;
    case GradientAction.REGISTER_GRADIENT:
      // Add the new gradient to the list of gradients, if the gradient (by id) does not already exist
      if (state.find((gradient) => gradient.id === action.payload.id)) {
        return state;
      }

      return [...state, action.payload];
    default:
      return state;
  }
};
