import { LedstripState } from "@angulon/interfaces";
import { Action } from "@ngrx/store";

export enum LedstripAction {
  RECEIVE_STATE = "RECEIVE_STATE",
  CHANGE_BRIGHTNESS = "CHANGE_BRIGHTNESS",
  CHANGE_COLORS = "CHANGE_COLORS",
  CHANGE_MODE = "CHANGE_MODE",
  CHANGE_SPEED = "CHANGE_SPEED"
}

export class ReceiveLedstripState implements Action {
  readonly type = LedstripAction.RECEIVE_STATE;

  constructor(public payload: LedstripState) {
  }
}

export class ChangeLedstripBrightness implements Action {
  readonly type = LedstripAction.CHANGE_BRIGHTNESS;

  constructor(public payload: number) {
  }
}

export class ChangeLedstripColors implements Action {
  readonly type = LedstripAction.CHANGE_COLORS;

  constructor(public payload: string[]) {
  }
}

export class ChangeLedstripMode implements Action {
  readonly type = LedstripAction.CHANGE_MODE;

  constructor(public payload: number) {
  }
}

export class ChangeLedstripSpeed implements Action {
  readonly type = LedstripAction.CHANGE_SPEED;

  constructor(public payload: number) {
  }
}


