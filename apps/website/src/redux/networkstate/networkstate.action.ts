import {INetworkState, IRoom} from '@angulon/interfaces';
import {Action} from '@ngrx/store';

export enum NetworkstateAction {
  LOAD_NETWORK_STATE = 'LOAD_NETWORK_STATE',
  SELECT_ROOM = 'SELECT_ROOM',
  UNSELECT_ROOM = 'UNSELECT_ROOM'
}

export class LoadNetworkState implements Action {
  readonly type = NetworkstateAction.LOAD_NETWORK_STATE;

  constructor(public payload: INetworkState) {
  }
}

export class SelectRoom implements Action {
  readonly type = NetworkstateAction.SELECT_ROOM;

  constructor(public payload: IRoom) {
  }
}

export class UnselectRoom implements Action {
  readonly type = NetworkstateAction.UNSELECT_ROOM;

  constructor(public payload: IRoom) {
  }
}
