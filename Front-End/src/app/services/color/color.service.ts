import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import iro from '@jaames/iro';
import {SerialConnectionService} from '../serial/serial-connection.service';
import {FileService} from '../file/file.service';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    picker: any;

    // tslint:disable-next-line:max-line-length
    constructor(@Inject(DOCUMENT) private document: HTMLDocument, private serialService: SerialConnectionService, private fileService: FileService) {
        // @ts-ignore
        const colorsSaved = this.fileService.readGeneralSettings().colors;
        setTimeout(() => {
            this.picker = iro.ColorPicker('#picker', {
                width: 200,
                layoutDirection: 'horizontal',
                handleRadius: 6,
                borderWidth: 2,
                borderColor: '#fff',
                wheelAngle: 90,
                colors: colorsSaved,

            });
            this.picker.on('color:change', (color) => {
                this.serialService.setColor(color.hexString);
            });
            this.picker.on('input:end', (color) => {
                console.log('event', this.picker.colors)
                this.fileService.saveColors(this.picker.colors)
            });
        }, 200);
    }

    get getFirstColorString(): string {
        return this.picker.colors[0].hexString;
    }

    get getSecondColorString(): string {
        return this.picker.colors[1].hexString;
    }

    get getThirdColorString(): string {
        return this.picker.colors[2].hexString;
    }
}
