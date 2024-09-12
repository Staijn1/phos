import { BaseReactiveChromaSDKEffect } from "./BaseReactiveChromaSDKEffect";
import { calculateBGRInteger, mapNumber } from "../../../shared/functions";
import { ChromaHeadsetEffectType, ChromaKeyboardEffectType, ChromaMouseEffectType, KEYBOARD_COLUMNS, KEYBOARD_ROWS, MOUSE_COLUMNS, MOUSE_ROWS } from "../RazerChromaSDKResponse";
import iro from "@jaames/iro";

export class InverseDoubleVuMeterChromaSDKEffect extends BaseReactiveChromaSDKEffect {
  protected _BGRIntegerForeground = 0;
  private _BGIntegerBackground = 0;

  updateEffect(): void {
    this.createInverseDoubleVuMeter(this.colors[0], this.colors[1]);
  }

  createInverseDoubleVuMeter(foregroundColor: iro.Color, backgroundColor: iro.Color): void {
    this._BGRIntegerForeground = calculateBGRInteger(foregroundColor.red, foregroundColor.green, foregroundColor.blue);
    this._BGIntegerBackground = calculateBGRInteger(backgroundColor.red, backgroundColor.green, backgroundColor.blue);

    const keyboardEffect = this.createKeyboardInverseDoubleVuMeter(this._BGIntegerBackground);
    const mouseEffect = this.createMouseInverseDoubleVuMeter(this._BGIntegerBackground);
    this.connection.setEffectsForDevices({
      keyboard: keyboardEffect,
      mouse: mouseEffect,
    }).then();
  }

  onEntry(): void {
    const headsetEffect = this.createHeadsetInverseDoubleVuMeter();
    this.connection.setEffectsForDevices({
      headset: headsetEffect,
    }).then();
  }

  onExit(): void {
  }

  protected createMouseInverseDoubleVuMeter(backgroundColor: number) {
    const mouseLed = new Array(MOUSE_ROWS);
    for (let r = 0; r < MOUSE_ROWS; r++) {
      mouseLed[r] = new Array(MOUSE_COLUMNS).fill(backgroundColor);
    }

    const amountOfRows = Math.round(mapNumber(this.fftIntensity, 0, 255, 0, MOUSE_ROWS, true));
    for (let r = 0; r < amountOfRows; r++) {
      mouseLed[MOUSE_ROWS - 1 - r][0] = this._BGRIntegerForeground;
      mouseLed[MOUSE_ROWS - 1 - r][6] = this._BGRIntegerForeground;

      mouseLed[r][0] = this._BGRIntegerForeground;
      mouseLed[r][6] = this._BGRIntegerForeground;
    }
    mouseLed[2][3] = this._BGRIntegerForeground;
    mouseLed[7][3] = this._BGRIntegerForeground;

    return this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, mouseLed);
  }

  protected createKeyboardInverseDoubleVuMeter(backgroundColor: number) {
    const amountOfColumns = Math.round(mapNumber(this.fftIntensity, 0, 255, 0, Math.floor(KEYBOARD_COLUMNS / 2), true));

    const key = new Array(KEYBOARD_ROWS).fill(new Array(KEYBOARD_COLUMNS).fill(backgroundColor));

    for (let row = 0; row < KEYBOARD_ROWS; row++) {
      for (let column = 0; column < KEYBOARD_COLUMNS; column++) {
        let color = this._BGRIntegerForeground;
        if (column < amountOfColumns || column >= KEYBOARD_COLUMNS - amountOfColumns) color = backgroundColor;

        key[row][column] = color;
      }
    }

    return this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM, key);
  }

  protected createHeadsetInverseDoubleVuMeter() {
    const color = this.colors[0];
    const bgr = calculateBGRInteger(color.red, color.green, color.blue);
    return this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, bgr);
  }
}
