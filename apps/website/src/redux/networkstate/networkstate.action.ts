import {INetworkState} from '@angulon/interfaces';
import {Action} from '@ngrx/store';

export enum NetworkstateAction {
  LOAD_NETWORK_STATE = 'LOAD_NETWORK_STATE',
}

export class LoadNetworkState implements Action {
  readonly type = NetworkstateAction.LOAD_NETWORK_STATE;

  constructor(public payload: INetworkState) {
  }
}
