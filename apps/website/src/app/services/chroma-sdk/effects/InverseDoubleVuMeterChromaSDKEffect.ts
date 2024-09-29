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

    const amountOfRows = Math.round(mapNumber(this.fftIntensity, 0, 255, 0, Math.floor(MOUSE_ROWS / 2), true));
    for (let r = 0; r < amountOfRows; r++) {
      mouseLed[Math.floor(MOUSE_ROWS / 2) - r - 1][0] = this._BGRIntegerForeground;
      mouseLed[Math.floor(MOUSE_ROWS / 2) - r - 1][MOUSE_COLUMNS - 1] = this._BGRIntegerForeground;
      mouseLed[Math.floor(MOUSE_ROWS / 2) + r][0] = this._BGRIntegerForeground;
      mouseLed[Math.floor(MOUSE_ROWS / 2) + r][MOUSE_COLUMNS - 1] = this._BGRIntegerForeground;
    }

    return this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, mouseLed);
  }

  protected createKeyboardInverseDoubleVuMeter(backgroundColor: number) {
    const amountOfColumns = Math.round(mapNumber(this.fftIntensity, 0, 255, 0, Math.floor(KEYBOARD_COLUMNS / 2), true));

    const key = Array.from({ length: KEYBOARD_ROWS }, () => Array(KEYBOARD_COLUMNS).fill(backgroundColor));

    for (let row = 0; row < KEYBOARD_ROWS; row++) {
      for (let column = 0; column < amountOfColumns; column++) {
        key[row][Math.floor(KEYBOARD_COLUMNS / 2) - column - 1] = this._BGRIntegerForeground;
        key[row][Math.floor(KEYBOARD_COLUMNS / 2) + column] = this._BGRIntegerForeground;
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
