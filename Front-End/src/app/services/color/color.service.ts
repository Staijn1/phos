import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import iro from '@jaames/iro';
import {SerialConnectionService} from '../serial/serial-connection.service';
import {ChromaEffectService} from '../chromaEffect/chroma-effect.service';
import {iroColorObject} from '../../types/types';
import {SettingsService} from '../settings/settings.service';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    picker: any;

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private serialService: SerialConnectionService,
        private settingsService: SettingsService,
        private chromaEffect: ChromaEffectService) {
        // @ts-ignore
        const colorsSaved = this.settingsService.readGeneralSettings().colors;
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

            this.picker.on('color:init', (iroColor: iroColorObject) => {
                this.serialService.setColor(this.picker.colors);
                this.chromaEffect.setColors = this.picker.colors;
            });
            this.picker.on('color:change', (iroColor: iroColorObject) => {
                this.serialService.setColor(this.picker.colors);
                this.chromaEffect.setColors = this.picker.colors;
            });
            this.picker.on('input:end', (iroColor) => {
                this.settingsService.saveGeneralSettings(this.picker.colors, undefined, undefined, undefined);
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

    get getFirstColorObject(): iroColorObject {
        try {
            return this.picker.colors[0];
        } catch (e) {
            return {
                red: 0,
                green: 0,
                blue: 0,
                hexString: '#000000',
                alpha: 0,
                hex8String: '',
                hsl: undefined,
                hslString: '',
                hsla: undefined,
                hslaString: '',
                hsv: undefined,
                hsva: undefined,
                hue: 0,
                kelvin: 0,
                rgb: undefined,
                rgbString: '',
                rgba: undefined,
                rgbaString: '',
                saturation: 0,
                value: 0
            };

        }

    }
}
