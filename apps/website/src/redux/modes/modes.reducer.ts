import { ModeInformation } from "@angulon/interfaces";

const initialState: ModeInformation[] = [];

export const modesReducer = (state: ModeInformation[] = initialState, action: any): ModeInformation[] => {
  switch (action.type) {
    default:
      return state;
  }
};
