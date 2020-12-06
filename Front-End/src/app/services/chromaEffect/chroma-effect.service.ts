import {Injectable} from '@angular/core';
import {ChromaSDKService} from '../chromaSDK/chromaSDK.service';
import {map} from '../../shared/functions';

@Injectable({
    providedIn: 'root'
})
export class ChromaEffectService {

    visualizerCounter = 0;

    constructor(private chromaSDK: ChromaSDKService) {
    }

    setStatic(color: any): void {
        const BGRColor = this.calculateBGRInteger(color.red, color.green, color.blue);
        this.chromaSDK.createKeyboardEffect('CHROMA_STATIC', BGRColor).then();
        this.chromaSDK.createMouseEffect('CHROMA_STATIC', BGRColor).then();
        this.chromaSDK.createHeadsetEffect('CHROMA_STATIC', BGRColor).then();
    }


    createVisualizer(value: number, colorToDisplay: any, backgroundColor = 0): void {
        this.visualizerCounter++;
        if (this.visualizerCounter % 5 !== 0) {
            return;
        } else {
            this.visualizerCounter = 0;
        }
        colorToDisplay = this.calculateBGRInteger(colorToDisplay.red, colorToDisplay.green, colorToDisplay.blue);
        this.chromaSDK.createHeadsetEffect('CHROMA_STATIC', colorToDisplay).then();

        const color = new Array(6);
        for (let r = 0; r < 6; r++) {
            color[r] = new Array(22);
            for (let c = 0; c < 22; c++) {
                color[r][c] = backgroundColor;
            }
        }
        const key = new Array(6);
        for (let r = 0; r < 6; r++) {
            key[r] = new Array(22);
            for (let c = 0; c < 22; c++) {
                key[r][c] = backgroundColor;
            }
        }

        const amountOfColumns = map(value, 255, 0, 21, 0, true);
        map(value, 0, 255, 25, 75);
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < amountOfColumns; c++) {
                key[r][c] = 0x01000000 | colorToDisplay;
            }

        }
        const data = {color, key};

        this.chromaSDK.createKeyboardEffect('CHROMA_CUSTOM_KEY', data).then();

        // Mouse
        const mouseLed = new Array(9);
        for (let r = 0; r < 9; r++) {
            mouseLed[r] = new Array(7);
            for (let c = 0; c < 7; c++) {
                mouseLed[r][c] = backgroundColor;
            }
        }

        // Column 0 is left side
        // Column 6 is right side
        // Razer mamba only has 7 visible.
        const amountOfRows = map(value, 0, 255, 0, 7, true);
        for (let r = 0; r < amountOfRows; r++) {
            mouseLed[r][0] = colorToDisplay;
            mouseLed[r][6] = colorToDisplay;
        }
        // Row 2 Column 3 has wheel
        // Row 7 Column 3 has logo
        mouseLed[2][3] = colorToDisplay;
        mouseLed[7][3] = colorToDisplay;
        this.chromaSDK.createMouseEffect('CHROMA_CUSTOM2', mouseLed).then();
    }

    private calculateBGRInteger = (red: number, green: number, blue: number): number => 65536 * blue + 256 * green + red;
}
