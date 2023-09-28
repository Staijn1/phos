import {GradientInformationExtended} from "@angulon/interfaces";
import {Action} from "@ngrx/store";

export enum GradientAction {
  LOAD = "LOAD",
}

export class LoadGradientsAction implements Action {
  readonly type = GradientAction.LOAD;

  constructor(public payload: GradientInformationExtended[]) {
  }
}
