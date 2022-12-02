import {Injectable} from '@angular/core';
import {SettingsService} from "../settings/settings.service";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme!: string;

  constructor(private settingsService: SettingsService) {
  }

  loadTheme(theme?: string) {
    if (!theme) {
      const currentSettings = this.settingsService.readGeneralSettings()
      theme = currentSettings.theme
    }
    document.body.className = theme
    this.theme = theme
  }

  setTheme(theme: string) {
    const currentSettings = this.settingsService.readGeneralSettings()
    currentSettings.theme = theme
    this.settingsService.saveGeneralSettings(currentSettings)
    this.loadTheme()
  }
}
