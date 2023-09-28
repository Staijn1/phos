import { ModeInformation } from "@angulon/interfaces";
import { Action } from "@ngrx/store";

export enum ModesAction {
  LOAD = "LOAD",
}

export class LoadModesAction implements Action {
  readonly type = ModesAction.LOAD;

  constructor(public payload: ModeInformation[]) {
  }
}
