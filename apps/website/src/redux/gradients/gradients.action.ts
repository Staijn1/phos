import {Action} from "@ngrx/store";
import {GradientInformation} from "@angulon/interfaces";

export enum GradientAction {
  LOAD_GRADIENTS = "LOAD_GRADIENTS",
}

export class LoadGradientsAction implements Action {
  readonly type = GradientAction.LOAD_GRADIENTS;

  constructor(public payload: GradientInformation[]) {
  }
}
