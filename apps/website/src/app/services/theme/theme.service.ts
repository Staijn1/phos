import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPreferences } from '../../shared/types/types';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme = 'default';
  get theme(): string {
    return this._theme;
  }

  constructor(private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
  }

  initialize(): void {
    this.store.select('userPreferences').subscribe(userPreferences => {
      this.applyTheme(userPreferences.settings.theme, userPreferences.settings.darkModeEnabled);
    });
  }

  applyTheme(theme: string, darkModeEnabled: boolean) {
    document.body.className = [theme, darkModeEnabled ? 'dark' : undefined].join(' ');
    this._theme = theme;
  }
}
