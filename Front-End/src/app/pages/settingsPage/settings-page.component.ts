import {Component, OnInit} from '@angular/core'
import {faSave} from '@fortawesome/free-solid-svg-icons'
import {SettingsService} from '../../services/settings/settings.service'
import {GeneralSettings} from '../../shared/types/types';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  settings: GeneralSettings
  saveIcon = faSave;

  constructor(private settingsService: SettingsService) {
    this.settings = this.settingsService.readGeneralSettings()
  }

  saveSettings(): void {
    this.settingsService.saveGeneralSettings(this.settings)
    location.reload()
  }
}
