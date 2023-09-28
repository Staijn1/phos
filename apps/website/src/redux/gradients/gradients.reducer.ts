import {GradientInformationExtended} from "@angulon/interfaces";
import {ModesAction} from "../modes/modes.action";

const initialState: GradientInformationExtended[] = [];

export const gradientsReducer = (state: GradientInformationExtended[] = initialState, action: any): GradientInformationExtended[] => {
  switch (action.type) {
    case ModesAction.LOAD:
      return action.payload;
    default:
      return state;
  }
};
