import {Component, OnInit} from '@angular/core'
import {faSave} from '@fortawesome/free-solid-svg-icons'
import {SettingsService} from '../../services/settings/settings.service'
import {GeneralSettings} from '../../shared/types/types'
import {ColorService} from '../../services/color/color.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  settings: GeneralSettings
  saveIcon = faSave;
  themes = [
    'default',
    'carrot',
    'banana',
    'cherry',
    'candy-cane',
    'sunday',
    'leaf',
    'seaweed',
    'sulfur',
    'yucca',
    'walnut',
    'elderberry'
  ];
  selectedTheme = 0;

  constructor(private settingsService: SettingsService, private colorService: ColorService) {
    this.settings = this.settingsService.readGeneralSettings()
  }

  saveSettings(): void {
    this.settingsService.saveGeneralSettings(this.settings)
    location.reload()
  }

  setTheme(theme: string, index: number): void {
    this.colorService.setTheme(theme)
    this.selectedTheme = index
    this.settings.theme = this.themes[this.selectedTheme]
  }
}
