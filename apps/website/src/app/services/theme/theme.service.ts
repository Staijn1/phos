import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPreferences } from '../../shared/types/types';
import { ThemeColors } from '../../shared/functions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private _theme = '';
  private userPreferencesSubscription: Subscription | undefined;

  get theme(): string {
    return this._theme;
  }

  constructor(private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
  }

  initialize(): void {
    this.userPreferencesSubscription = this.store.select('userPreferences').subscribe(userPreferences => {
      this.applyTheme(userPreferences.settings.theme);
    });
  }

  applyTheme(theme: string) {
    // Set the data-theme attribute on the html tag. This will apply one of the (custom or built-in) daisyui themes
    document.documentElement.setAttribute('data-theme', theme);

    // Get the theme-color meta-tag.
    // The value of this tag will change the color of the address bar when installed as a PWA
    const metaTag = document.querySelector('meta[name="theme-color"]');

    // Situation: We want to set the color of the address bar to the primary color of the theme. But the primary color is defined in CSS variables
    // Problem: The meta-tag does not support CSS variables
    // Solution: Get the value of the CSS variable and use it in the meta-tag to prevent usage of the var() function in the meta-tag
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--p');
    metaTag?.setAttribute('content', `oklch(${primaryColor}`);

    this._theme = theme;
  }

  ngOnDestroy(): void {
    this.userPreferencesSubscription?.unsubscribe();
  }

  /**
   * Extract the daisyui theme colors from the DOM, so we can use them in Javascript
   */
  public static extractThemeColorsFromDOM = (): ThemeColors | null => {
    const root = document.querySelector(':root');

    if (!root) {
      return null;
    }

    const computedStyles = getComputedStyle(root);
    return {
      primary: `oklch(${computedStyles.getPropertyValue('--p')}`,
      primaryContent: `oklch(${computedStyles.getPropertyValue('--pc')}`,
      secondary: `oklch(${computedStyles.getPropertyValue('--s')}`,
      secondaryContent: `oklch(${computedStyles.getPropertyValue('--sc')}`,
      accent: `oklch(${computedStyles.getPropertyValue('--a')}`,
      accentContent: `oklch(${computedStyles.getPropertyValue('--ac')}`,
      neutral: `oklch(${computedStyles.getPropertyValue('--n')}`,
      neutralContent: `oklch(${computedStyles.getPropertyValue('--nc')}`,
      base100: `oklch(${computedStyles.getPropertyValue('--b1')}`,
      base200: `oklch(${computedStyles.getPropertyValue('--b2')}`,
      base300: `oklch(${computedStyles.getPropertyValue('--b3')}`,
      baseContent: `oklch(${computedStyles.getPropertyValue('--bc')}`,
      info: `oklch(${computedStyles.getPropertyValue('--in')}`,
      infoContent: `oklch(${computedStyles.getPropertyValue('--inc')}`,
      success: `oklch(${computedStyles.getPropertyValue('--su')}`,
      successContent: `oklch(${computedStyles.getPropertyValue('--suc')}`,
      warning: `oklch(${computedStyles.getPropertyValue('--wa')}`,
      warningContent: `oklch(${computedStyles.getPropertyValue('--wac')}`,
      error: `oklch(${computedStyles.getPropertyValue('--er')}`,
      errorContent: `oklch(${computedStyles.getPropertyValue('--erc')}`,
    };
  };
}
