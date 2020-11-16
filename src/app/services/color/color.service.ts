import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import iro from '@jaames/iro';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    picker: any;

    constructor(@Inject(DOCUMENT) private document: HTMLDocument) {
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
