import {Component, OnInit} from '@angular/core';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {SettingsService} from '../../services/settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  saveIcon = faSave;
  chroma: boolean;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.chroma = this.settingsService.readGeneralSettings().chroma;
  }

  saveSettings(): void {
    this.settingsService.saveGeneralSettings(undefined, this.chroma);
    location.reload();
  }
}
