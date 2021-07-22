import {Component, OnInit} from '@angular/core'
import {faSave} from '@fortawesome/free-solid-svg-icons'
import {SettingsService} from '../../services/settings/settings.service'
import {ColorService} from '../../services/color/color.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  saveIcon = faSave;
  chroma: boolean;
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
  }

  ngOnInit(): void {
    const currentSettings = this.settingsService.readGeneralSettings()
    this.chroma = currentSettings.chroma
    this.selectedTheme = this.themes.findIndex(theme => theme === currentSettings.theme) || 0
  }

  saveSettings(): void {
    this.settingsService.saveGeneralSettings(undefined, this.chroma, this.themes[this.selectedTheme])
    location.reload()
  }

  setTheme(theme: string, index: number): void {
    this.colorService.setTheme(theme)
    this.selectedTheme = index
  }
}
