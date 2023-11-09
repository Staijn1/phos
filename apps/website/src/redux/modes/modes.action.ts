import { ModeInformation } from '@angulon/interfaces';
import { Action } from '@ngrx/store';

export enum ModesAction {
  LOAD_MODES = 'LOAD_MODES',
}

export class LoadModesAction implements Action {
  readonly type = ModesAction.LOAD_MODES;

  constructor(public payload: ModeInformation[]) {
  }
}
