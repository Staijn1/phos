import { ClientSideRoomState, RoomState } from "@angulon/interfaces";
import { Action } from '@ngrx/store';
import iro from "@jaames/iro";

export enum RoomStateAction {
  RECEIVE_SERVER_STATE = 'RECEIVE_SERVER_STATE',
  CHANGE_COLORS = 'CHANGE_COLORS',
  CHANGE_MODE = 'CHANGE_MODE',
  INCREASE_BRIGHTNESS = 'INCREASE_BRIGHTNESS',
  DECREASE_BRIGHTNESS = 'DECREASE_BRIGHTNESS',
  INCREASE_SPEED = 'INCREASE_SPEED',
  DECREASE_SPEED = 'DECREASE_SPEED',
  MULTIPLE_PROPERTIES = 'MULTIPLE_PROPERTIES',
}

export class ReceiveServerRoomState implements Action {
  readonly type = RoomStateAction.RECEIVE_SERVER_STATE;

  constructor(public payload: RoomState) {
  }
}

export class IncreaseRoomBrightness implements Action {
  readonly type = RoomStateAction.INCREASE_BRIGHTNESS;
}

export class DecreaseRoomBrightness implements Action {
  readonly type = RoomStateAction.DECREASE_BRIGHTNESS;
}

export class ChangeRoomColors implements Action {
  readonly type = RoomStateAction.CHANGE_COLORS;

  constructor(public payload: iro.Color[]) {
  }
}

export class ChangeRoomMode implements Action {
  readonly type = RoomStateAction.CHANGE_MODE;

  constructor(public payload: number) {
  }
}

export class IncreaseRoomSpeed implements Action {
  readonly type = RoomStateAction.INCREASE_SPEED;
}

export class DecreaseRoomSpeed implements Action {
  readonly type = RoomStateAction.DECREASE_SPEED;
}

export class ChangeMultipleRoomProperties implements Action {
  readonly type = RoomStateAction.MULTIPLE_PROPERTIES;

  constructor(public payload: Partial<ClientSideRoomState>) {
  }
}
