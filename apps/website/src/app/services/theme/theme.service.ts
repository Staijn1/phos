import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {UserPreferences} from '../../shared/types/types';
import {MessageService} from '../message-service/message.service';
import {ThemeColors} from '../../shared/functions';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme = '';
  get theme(): string {
    return this._theme;
  }

  constructor(private readonly messageService: MessageService, private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
  }

  initialize(): void {
    this.store.select('userPreferences').subscribe(userPreferences => {
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
    metaTag?.setAttribute('content', `hsl(${primaryColor}`);

    this._theme = theme;
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
      primary: `hsl(${computedStyles.getPropertyValue('--p')}`,
      primaryFocus: `hsl(${computedStyles.getPropertyValue('--pf')}`,
      primaryContent: `hsl(${computedStyles.getPropertyValue('--pc')}`,
      secondary: `hsl(${computedStyles.getPropertyValue('--s')}`,
      secondaryFocus: `hsl(${computedStyles.getPropertyValue('--sf')}`,
      secondaryContent: `hsl(${computedStyles.getPropertyValue('--sc')}`,
      accent: `hsl(${computedStyles.getPropertyValue('--a')}`,
      accentFocus: `hsl(${computedStyles.getPropertyValue('--af')}`,
      accentContent: `hsl(${computedStyles.getPropertyValue('--ac')}`,
      neutral: `hsl(${computedStyles.getPropertyValue('--n')}`,
      neutralFocus: `hsl(${computedStyles.getPropertyValue('--nf')}`,
      neutralContent: `hsl(${computedStyles.getPropertyValue('--nc')}`,
      base100: `hsl(${computedStyles.getPropertyValue('--b1')}`,
      base200: `hsl(${computedStyles.getPropertyValue('--b2')}`,
      base300: `hsl(${computedStyles.getPropertyValue('--b3')}`,
      baseContent: `hsl(${computedStyles.getPropertyValue('--bc')}`,
      info: `hsl(${computedStyles.getPropertyValue('--in')}`,
      infoContent: `hsl(${computedStyles.getPropertyValue('--inc')}`,
      success: `hsl(${computedStyles.getPropertyValue('--su')}`,
      successContent: `hsl(${computedStyles.getPropertyValue('--suc')}`,
      warning: `hsl(${computedStyles.getPropertyValue('--wa')}`,
      warningContent: `hsl(${computedStyles.getPropertyValue('--wac')}`,
      error: `hsl(${computedStyles.getPropertyValue('--er')}`,
      errorContent: `hsl(${computedStyles.getPropertyValue('--erc')}`,
    };
  };
}
