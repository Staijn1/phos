import {Injectable} from '@angular/core';
import {SettingsService} from "../settings/settings.service";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private settingsService: SettingsService) {
  }

  loadTheme() {
    const currentSettings = this.settingsService.readGeneralSettings()
    document.body.className = currentSettings.theme
  }

  setTheme(theme: string) {
    const currentSettings = this.settingsService.readGeneralSettings()
    currentSettings.theme = theme
    this.settingsService.saveGeneralSettings(currentSettings)
    this.loadTheme()
  }
}
