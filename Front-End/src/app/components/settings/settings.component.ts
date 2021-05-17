import {Component, OnInit} from '@angular/core';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {SettingsService} from '../../services/settings/settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    coms = [];
    saveIcon = faSave;
    selectedCom: string;
    numLeds: number;
    chroma: boolean;

    constructor(private settingsService: SettingsService) {
    }

    ngOnInit(): void {
        this.chroma = this.settingsService.readGeneralSettings().chroma;
    }

    saveSettings(): void {
        this.settingsService.saveGeneralSettings(undefined, this.selectedCom, this.numLeds, this.chroma);
    }
}
