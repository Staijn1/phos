import {Component, OnInit} from '@angular/core';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
import * as $ from 'jquery';
import {FileService} from '../../services/file/file.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: []
})
export class SettingsComponent implements OnInit {
    productId: number;
    productName: string;
    price: number;
    url: string;

    coms = [];

    constructor(private fileService: FileService, private serialService: SerialConnectionService) {
    }

    ngOnInit(): void {
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
        })
    }

    saveSettings(): void {
        const selectedCom = <string>$('#coms').val();
        this.fileService.saveCom(selectedCom);
        console.log('selected:', selectedCom)
        // this.serialService.update();
    }
}
