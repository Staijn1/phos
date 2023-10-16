import iro from "@jaames/iro";
import { calculateBGRInteger, mapNumber } from "../../../shared/functions";
import {
  ChromaHeadsetEffectType,
  ChromaKeyboardEffectType,
  ChromaMouseEffectType
} from "../../old/chromaSDK/old-chroma-s-d-k.service";
import { BaseReactiveChromaSDKEffect } from "./BaseReactiveChromaSDKEffect";
import { KEYBOARD_COLUMNS, KEYBOARD_ROWS } from "../RazerChromaSDKTypes";

export class VisualizerChromaSDKEffect extends BaseReactiveChromaSDKEffect {
  protected _BGRIntegerForeground = 0;
  protected _previousIntensity!: number;
  private _BGIntegerBackground = 0;

  updateEffect(): void {
    this.createVisualizer(this.colors[0], this.colors[1]);
  }

  createVisualizer(foregroundColor: iro.Color, backgroundColor: iro.Color): void {
    this._BGRIntegerForeground = calculateBGRInteger(foregroundColor.red, foregroundColor.green, foregroundColor.blue);
    this._BGIntegerBackground = calculateBGRInteger(backgroundColor.red, backgroundColor.green, backgroundColor.blue);

    // Nothing changed so let's not waste resources to set the same effect again.
    if (this.fftIntensity === this._previousIntensity) return;

    this._previousIntensity = this.fftIntensity;

    this.createKeyBoardVisualizer(this._BGIntegerBackground);
    this.createMouseVisualizer(this._BGIntegerBackground);
  }

  onEntry(): void {
    this.createHeadsetVisualizer();
  }

  onExit(): void {
  }

  protected createMouseVisualizer(backgroundColor: number) {
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
    const amountOfRows = mapNumber(this.fftIntensity, 0, 1, 0, 7, true);
    for (let r = 0; r < amountOfRows; r++) {
      mouseLed[r][0] = this._BGRIntegerForeground;
      mouseLed[r][KEYBOARD_ROWS] = this._BGRIntegerForeground;
    }
    // Row 2 Column 3 has wheel
    // Row 7 Column 3 has logo
    mouseLed[2][3] = this._BGRIntegerForeground;
    mouseLed[7][3] = this._BGRIntegerForeground;
    this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, mouseLed).then();
  }

  protected createKeyBoardVisualizer(backgroundColor: number) {
    const amountOfColumns = Math.round(mapNumber(this.fftIntensity, 255, 0, KEYBOARD_COLUMNS, 0, true));

    const color = new Array(KEYBOARD_ROWS).fill(new Array(KEYBOARD_COLUMNS).fill(backgroundColor));
    const key = new Array(KEYBOARD_ROWS).fill(new Array(KEYBOARD_COLUMNS).fill(backgroundColor));

    for (let r = 0; r < KEYBOARD_ROWS; r++) {
      for (let c = 0; c < amountOfColumns; c++) {
        key[r][c] = 0x01000000 | this._BGRIntegerForeground;
      }
    }



    const data = { color, key };
    this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM_KEY, data).then();
  }


  protected createHeadsetVisualizer() {
    const color = this.colors[0];
    const bgr = calculateBGRInteger(color.red, color.green, color.blue);
    this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, bgr).then();
  }
}
