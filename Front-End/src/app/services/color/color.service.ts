import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import iro from '@jaames/iro';
import {SerialConnectionService} from '../serial/serial-connection.service';
import {FileService} from '../file/file.service';
import {ChromaEffectService} from '../chromaEffect/chroma-effect.service';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    picker: any;

    // tslint:disable-next-line:max-line-length
    constructor(@Inject(DOCUMENT) private document: HTMLDocument, private serialService: SerialConnectionService, private fileService: FileService, private chromaEffect: ChromaEffectService) {
        // @ts-ignore
        const colorsSaved = this.fileService.readGeneralSettings().colors;
        setTimeout(() => {
            this.picker = iro.ColorPicker('#picker', {
                width: 150,
                layoutDirection: 'horizontal',
                handleRadius: 6,
                borderWidth: 2,
                borderColor: '#fff',
                wheelAngle: 90,
                colors: colorsSaved,
            });

            this.picker.on('color:init', (iroColor) => {
                console.log(' init');
                serialService.setColor(iroColor.hexString);
            });
            this.picker.on('color:change', (iroColor) => {
                this.serialService.setColor(iroColor.hexString);
                this.chromaEffect.setStatic(iroColor);
            });
            this.picker.on('input:end', (iroColor) => {
                this.fileService.saveColors(this.picker.colors);
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

    get getFirstColorObject(): any {
        try {
            return this.picker.colors[0];
        } catch (e) {
            return {
                red: 0,
                green: 0,
                blue: 0,
                hexString: '#000000'
            };

        }

    }
}
