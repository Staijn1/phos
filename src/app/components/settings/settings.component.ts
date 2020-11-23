import {Component, OnInit} from '@angular/core';
import {AppSettingsService} from '../../shared/appsettings.service';
import {AppSettings} from '../../shared/appsettings';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [AppSettingsService]
})
export class SettingsComponent implements OnInit {
    productId: number;
    productName: string;
    price: number;
    url: string;

    settings: AppSettings;
    coms = [];

    constructor(private appSettingsService: AppSettingsService, private serialService: SerialConnectionService) {
    }

    ngOnInit(): void {
        this.appSettingsService.getSettings().subscribe(settings => this.settings = settings, () => null, () => {
            console.log(this.settings.defaultPrice);
            console.log(this.settings.defaultUrl);
        });

        let index = 0;
        this.serialService.scan().then(ports => {
            ports.forEach(port => {
                const details = {
                    id: index,
                    comName: port.comName,
                };
                this.coms.push(details)
                index++;
            })
            console.log(this.coms)
        })
    }

    saveSettings(): void {
        const selectedCom = <string>$('#coms').val();
        console.log(selectedCom)
        localStorage.setItem('com', selectedCom);
        console.log(localStorage.getItem('com'));
        // this.serialService.update();
    }
}
