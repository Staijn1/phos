import {Component} from '@angular/core'
import {faSave} from '@fortawesome/free-solid-svg-icons'
import {SettingsService} from '../../services/settings/settings.service'
import {GeneralSettings} from '../../shared/types/types'
import {ThemeService} from "../../services/theme/theme.service";
import {themes} from '../../shared/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  settings: GeneralSettings
  saveIcon = faSave;
  themes = themes;
  selectedTheme = 0;

  constructor(private settingsService: SettingsService, private readonly theme: ThemeService) {
    this.settings = this.settingsService.readGeneralSettings()
  }

  saveSettings(): void {
    this.settingsService.saveGeneralSettings(this.settings)
    location.reload()
  }

  setTheme(theme: string, index: number): void {
    this.selectedTheme = index
    this.settings.theme = this.themes[this.selectedTheme]
    this.theme.setTheme(this.settings.theme)
  }
}