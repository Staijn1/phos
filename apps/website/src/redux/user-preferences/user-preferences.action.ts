import { Action } from '@ngrx/store';
import { AngulonVisualizerOptions, GeneralSettings } from '../../app/shared/types/types';

export enum UserPreferencesAction {
  CHANGE_GENERAL_SETTINGS = 'CHANGE_GENERAL_SETTINGS',
  CHANGE_VISUALIZER_OPTIONS = 'CHANGE_VISUALIZER_OPTIONS',
  SET_DEFAULT_USER_PREFERENCES = 'SET_DEFAULT_USER_PREFERENCES'
}

export class ChangeGeneralSettings implements Action {
  readonly type = UserPreferencesAction.CHANGE_GENERAL_SETTINGS;

  constructor(public payload: Partial<GeneralSettings>) {
  }
}

export class ChangeVisualizerOptions implements Action {
  readonly type: UserPreferencesAction = UserPreferencesAction.CHANGE_VISUALIZER_OPTIONS;

  constructor(public payload: Partial<AngulonVisualizerOptions>) {
  }
}

export class SetDefaultUserPreferences implements Action {
  readonly type: UserPreferencesAction = UserPreferencesAction.SET_DEFAULT_USER_PREFERENCES;
}
