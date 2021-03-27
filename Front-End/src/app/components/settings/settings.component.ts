import {Component, OnInit} from '@angular/core';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
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

    constructor(private settingsService: SettingsService, private serialService: SerialConnectionService) {
    }

    ngOnInit(): void {
        let index = 0;
        this.serialService.scan().then(ports => {
            ports.forEach(port => {
                const details = {
                    id: index,
                    path: port.path,
                };
                this.coms.push(details);
                index++;
            });
        });

        this.selectedCom = this.settingsService.readGeneralSettings().com;
        this.chroma = this.settingsService.readGeneralSettings().chroma;
    }

    saveSettings(): void {
        this.settingsService.saveGeneralSettings(undefined, this.selectedCom, this.numLeds, this.chroma);
        this.serialService.update();
    }
}
