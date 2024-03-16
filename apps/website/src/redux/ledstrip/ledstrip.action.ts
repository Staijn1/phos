import { ClientSideLedstripState, RoomState } from "@angulon/interfaces";
import { Action } from '@ngrx/store';
import iro from "@jaames/iro";

export enum LedstripAction {
  RECEIVE_SERVER_STATE = 'RECEIVE_SERVER_STATE',
  CHANGE_COLORS = 'CHANGE_COLORS',
  CHANGE_MODE = 'CHANGE_MODE',
  INCREASE_BRIGHTNESS = 'INCREASE_BRIGHTNESS',
  DECREASE_BRIGHTNESS = 'DECREASE_BRIGHTNESS',
  INCREASE_SPEED = 'INCREASE_SPEED',
  DECREASE_SPEED = 'DECREASE_SPEED',
  MULTIPLE_PROPERTIES = 'MULTIPLE_PROPERTIES',
}

export class ReceiveServerLedstripState implements Action {
  readonly type = LedstripAction.RECEIVE_SERVER_STATE;

  constructor(public payload: RoomState) {
  }
}

export class IncreaseLedstripBrightness implements Action {
  readonly type = LedstripAction.INCREASE_BRIGHTNESS;
}

export class DecreaseLedstripBrightness implements Action {
  readonly type = LedstripAction.DECREASE_BRIGHTNESS;
}

export class ChangeLedstripColors implements Action {
  readonly type = LedstripAction.CHANGE_COLORS;

  constructor(public payload: iro.Color[]) {
  }
}

export class ChangeLedstripMode implements Action {
  readonly type = LedstripAction.CHANGE_MODE;

  constructor(public payload: number) {
  }
}

export class IncreaseLedstripSpeed implements Action {
  readonly type = LedstripAction.INCREASE_SPEED;
}

export class DecreaseLedstripSpeed implements Action {
  readonly type = LedstripAction.DECREASE_SPEED;
}

export class ChangeMultipleLedstripProperties implements Action {
  readonly type = LedstripAction.MULTIPLE_PROPERTIES;

  constructor(public payload: Partial<ClientSideLedstripState>) {
  }
}
