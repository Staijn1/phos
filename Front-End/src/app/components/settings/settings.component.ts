import {Component, OnInit} from '@angular/core';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
import {FileService} from '../../services/file/file.service';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {ColorService} from '../../services/color/color.service';

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

    constructor(private fileService: FileService, private serialService: SerialConnectionService, private colorService: ColorService) {
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
        // @ts-ignore
        this.selectedCom = this.fileService.readGeneralSettings().com;

        // @ts-ignore
        this.numLeds = this.fileService.readGeneralSettings().leds;
    }

    saveSettings(): void {
        this.fileService.saveGeneralSettings(this.selectedCom, this.numLeds);
        this.serialService.update();
    }
}
