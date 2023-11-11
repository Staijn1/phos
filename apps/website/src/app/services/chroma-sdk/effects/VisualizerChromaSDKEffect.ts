import iro from '@jaames/iro';
import {calculateBGRInteger, mapNumber} from '../../../shared/functions';
import {BaseReactiveChromaSDKEffect} from './BaseReactiveChromaSDKEffect';
import {
  ChromaHeadsetEffectType,
  ChromaKeyboardEffectType,
  ChromaMouseEffectType,
  KEYBOARD_COLUMNS,
  KEYBOARD_ROWS,
  MOUSE_COLUMNS,
  MOUSE_ROWS
} from "../RazerChromaSDKResponse";

export class VisualizerChromaSDKEffect extends BaseReactiveChromaSDKEffect {
  protected _BGRIntegerForeground = 0;
  private _BGIntegerBackground = 0;

  updateEffect(): void {
    this.createVisualizer(this.colors[0], this.colors[1]);
  }

  createVisualizer(foregroundColor: iro.Color, backgroundColor: iro.Color): void {
    this._BGRIntegerForeground = calculateBGRInteger(foregroundColor.red, foregroundColor.green, foregroundColor.blue);
    this._BGIntegerBackground = calculateBGRInteger(backgroundColor.red, backgroundColor.green, backgroundColor.blue);

    const keyboardEffect = this.createKeyBoardVisualizer(this._BGIntegerBackground);
    const mouseEffect = this.createMouseVisualizer(this._BGIntegerBackground);
    this.connection.setEffectsForDevices({
      keyboard: keyboardEffect,
      mouse: mouseEffect,
    }).then();
  }

  onEntry(): void {
    const headsetEffect = this.createHeadsetVisualizer();
    this.connection.setEffectsForDevices({
      headset: headsetEffect,
    }).then();
  }

  onExit(): void {
  }

  protected createMouseVisualizer(backgroundColor: number) {
    // Mouse, first set all to background color
    const mouseLed = new Array(MOUSE_ROWS);
    for (let r = 0; r < 9; r++) {
      mouseLed[r] = new Array(MOUSE_COLUMNS);
      for (let c = 0; c < 7; c++) {
        mouseLed[r][c] = backgroundColor;
      }
    }

    // Column 0 is left side
    // Column 6 is right side
    // Razer mamba only has 7 visible.
    const amountOfRows = Math.round(mapNumber(this.fftIntensity, 0, 255, 0, 7, true));
    for (let r = 0; r < amountOfRows; r++) {
      mouseLed[r][0] = this._BGRIntegerForeground;
      mouseLed[r][6] = this._BGRIntegerForeground;
    }
    // Row 2 Column 3 has wheel
    // Row 7 Column 3 has logo
    mouseLed[2][3] = this._BGRIntegerForeground;
    mouseLed[7][3] = this._BGRIntegerForeground;

    return this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, mouseLed);
  }


  protected createKeyBoardVisualizer(backgroundColor: number) {
    const amountOfColumns = Math.round(mapNumber(this.fftIntensity, 255, 0, KEYBOARD_COLUMNS, 0, true));

    // const color = new Array(KEYBOARD_ROWS).fill(new Array(KEYBOARD_COLUMNS).fill(backgroundColor));
    const key = new Array(KEYBOARD_ROWS).fill(new Array(KEYBOARD_COLUMNS).fill(backgroundColor));

    for (let row = 0; row < KEYBOARD_ROWS; row++) {
      for (let column = 0; column < KEYBOARD_COLUMNS; column++) {
        let color = this._BGRIntegerForeground;
        if (column > amountOfColumns) color = backgroundColor;

        key[row][column] = color;
      }
    }

    return this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM, key);
  }


  protected createHeadsetVisualizer() {
    const color = this.colors[0];
    const bgr = calculateBGRInteger(color.red, color.green, color.blue);
    return this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, bgr);
  }
}
