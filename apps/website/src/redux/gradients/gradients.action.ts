import { Action } from "@ngrx/store";
import { GradientInformation } from "@angulon/interfaces";

export enum GradientAction {
  LOAD_GRADIENTS = "LOAD_GRADIENTS",
  REGISTER_GRADIENT = "REGISTER_GRADIENT",
}

export class LoadGradientsAction implements Action {
  readonly type = GradientAction.LOAD_GRADIENTS;

  constructor(public payload: GradientInformation[]) {
  }
}

export class RegisterGradientAction implements Action {
  readonly type = GradientAction.REGISTER_GRADIENT;

  constructor(public payload: GradientInformation) {
  }
}
