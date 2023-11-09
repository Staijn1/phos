import { ModeInformation } from '@angulon/interfaces';
import { ModesAction } from './modes.action';

const initialState: ModeInformation[] = [];

export const modesReducer = (state: ModeInformation[] = initialState, action: any): ModeInformation[] => {
  switch (action.type) {
    case ModesAction.LOAD_MODES:
      return action.payload;
    default:
      return state;
  }
};
