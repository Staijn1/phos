import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import iro from '@jaames/iro';
import {SerialConnectionService} from '../serial/serial-connection.service';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    picker: any;

    constructor(@Inject(DOCUMENT) private document: HTMLDocument, private serialService: SerialConnectionService) {
        setTimeout(() => {
            this.picker = iro.ColorPicker('#picker', {
                width: 200,
                layoutDirection: 'horizontal',
                handleRadius: 6,
                borderWidth: 2,
                borderColor: '#fff',
                wheelAngle: 90,
                colors: [
                    'rgb(100%, 0, 0)', // pure red
                    'rgb(0, 100%, 0)', // pure green
                    'rgb(0, 0, 100%)', // pure blue
                ],
            });
            this.picker.on('change', () => {
                console.log('Hoi')
            })
        }, 1);


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
