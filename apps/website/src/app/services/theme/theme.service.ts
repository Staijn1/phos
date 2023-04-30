import {Injectable} from "@angular/core";
import {SettingsService} from "../settings/settings.service";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  theme!: string;

  constructor(private settingsService: SettingsService) {
  }

  loadTheme(theme?: string) {
    const currentSettings = this.settingsService.readGeneralSettings();
    if (!theme) {
      theme = currentSettings.theme;
    }
    document.body.className = [theme, currentSettings.darkmodeEnabled ? "dark" : undefined].join(" ");
    this.theme = theme;
  }

  setTheme(theme: string) {
    const currentSettings = this.settingsService.readGeneralSettings();
    currentSettings.theme = theme;
    this.settingsService.saveGeneralSettings(currentSettings);
    this.loadTheme();
  }
}
