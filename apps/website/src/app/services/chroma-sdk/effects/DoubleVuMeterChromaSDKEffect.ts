import { BaseReactiveChromaSDKEffect } from "./BaseReactiveChromaSDKEffect";
import { calculateBGRInteger, mapNumber } from "../../../shared/functions";
import { ChromaHeadsetEffectType, ChromaKeyboardEffectType, ChromaMouseEffectType, KEYBOARD_COLUMNS, KEYBOARD_ROWS, MOUSE_COLUMNS, MOUSE_ROWS } from "../RazerChromaSDKResponse";
import iro from "@jaames/iro";

export class DoubleVuMeterChromaSDKEffect extends BaseReactiveChromaSDKEffect {
  protected _BGRIntegerForeground = 0;
  private _BGIntegerBackground = 0;

  updateEffect(): void {
    this.createDoubleVuMeter(this.colors[0], this.colors[1]);
  }

  createDoubleVuMeter(foregroundColor: iro.Color, backgroundColor: iro.Color): void {
    this._BGRIntegerForeground = calculateBGRInteger(foregroundColor.red, foregroundColor.green, foregroundColor.blue);
    this._BGIntegerBackground = calculateBGRInteger(backgroundColor.red, backgroundColor.green, backgroundColor.blue);

    const keyboardEffect = this.createKeyboardDoubleVuMeter(this._BGIntegerBackground);
    const mouseEffect = this.createMouseDoubleVuMeter(this._BGIntegerBackground);
    this.connection.setEffectsForDevices({
      keyboard: keyboardEffect,
      mouse: mouseEffect,
    }).then();
  }

  onEntry(): void {
    const headsetEffect = this.createHeadsetDoubleVuMeter();
    this.connection.setEffectsForDevices({
      headset: headsetEffect,
    }).then();
  }

  onExit(): void {
  }

  protected createMouseDoubleVuMeter(backgroundColor: number) {
    const mouseLed = new Array(MOUSE_ROWS);
    for (let r = 0; r < 9; r++) {
      mouseLed[r] = new Array(MOUSE_COLUMNS);
      for (let c = 0; c < 7; c++) {
        mouseLed[r][c] = backgroundColor;
      }
    }

    const amountOfRows = Math.round(mapNumber(this.fftIntensity, 0, 255, 0, 7, true));
    for (let r = 0; r < amountOfRows; r++) {
      mouseLed[r][0] = this._BGRIntegerForeground;
      mouseLed[r][6] = this._BGRIntegerForeground;
    }
    mouseLed[2][3] = this._BGRIntegerForeground;
    mouseLed[7][3] = this._BGRIntegerForeground;

    return this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, mouseLed);
  }

  protected createKeyboardDoubleVuMeter(backgroundColor: number) {
    const amountOfColumns = Math.round(mapNumber(this.fftIntensity, 0, 255, 0, Math.floor(KEYBOARD_COLUMNS / 2), true));

    const key = new Array(KEYBOARD_ROWS).fill(new Array(KEYBOARD_COLUMNS).fill(backgroundColor));

    for (let row = 0; row < KEYBOARD_ROWS; row++) {
      for (let column = 0; column < KEYBOARD_COLUMNS; column++) {
        let color = this._BGRIntegerForeground;
        if (column > amountOfColumns && column < KEYBOARD_COLUMNS - amountOfColumns) color = backgroundColor;

        key[row][column] = color;
      }
    }

    return this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM, key);
  }

  protected createHeadsetDoubleVuMeter() {
    const color = this.colors[0];
    const bgr = calculateBGRInteger(color.red, color.green, color.blue);
    return this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, bgr);
  }
}
