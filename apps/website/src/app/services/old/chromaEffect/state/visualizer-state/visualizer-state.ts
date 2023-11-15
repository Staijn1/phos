import { State } from '../abstract/state';
import { calculateBGRInteger, mapNumber } from '../../../../../shared/functions';
import iro from '@jaames/iro';
import {
  ChromaHeadsetEffectType,
  ChromaKeyboardEffectType,
  ChromaMouseEffectType
} from "../../../../chroma-sdk/RazerChromaSDKResponse";

export class VisualizerState extends State {
  protected _BGRIntegerForeground = 0;
  protected _previousBGRIntegerForeground!: number;
  protected _previousIntensity!: number;
  private _BGIntegerBackground = 0;

  protected _intensity = 0;

  set intensity(value: number) {
    this._previousIntensity = this._intensity;
    this._intensity = value;
  }

  handle(colors: iro.Color[]): void {
    if (!colors) return;
    this.createVisualizer(colors[0], colors[1]);
  }

  createVisualizer(foregroundColor: iro.Color, backgroundColor: iro.Color): void {
    this._BGRIntegerForeground = calculateBGRInteger(foregroundColor.red, foregroundColor.green, foregroundColor.blue);
    this._BGIntegerBackground = calculateBGRInteger(backgroundColor.red, backgroundColor.green, backgroundColor.blue);

    // Nothing changed so let's not waste resources to set the same effect again.
    if (this._intensity === this._previousIntensity) return;

    this.createHeadsetVisualizer();
    this.createKeyBoardVisualizer(this._BGIntegerBackground);
    this.createMouseVisualizer(this._BGIntegerBackground);
  }

  onEntry(): void {
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
    const amountOfRows = mapNumber(this._intensity, 0, 1, 0, 7, true);
    for (let r = 0; r < amountOfRows; r++) {
      mouseLed[r][0] = this._BGRIntegerForeground;
      mouseLed[r][6] = this._BGRIntegerForeground;
    }
    // Row 2 Column 3 has wheel
    // Row 7 Column 3 has logo
    mouseLed[2][3] = this._BGRIntegerForeground;
    mouseLed[7][3] = this._BGRIntegerForeground;
    this._context.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, mouseLed).then();
  }

  protected createKeyBoardVisualizer(backgroundColor: number) {
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

    const amountOfColumns = mapNumber(this._intensity, 1, 0, 21, 0, true);
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < amountOfColumns; c++) {
        key[r][c] = 0x01000000 | this._BGRIntegerForeground;
      }

    }
    const data = { color, key };

    this._context.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM_KEY, data).then();
  }

  protected createHeadsetVisualizer() {
    if (this._BGRIntegerForeground !== this._previousBGRIntegerForeground) {
      this._context.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, this._BGRIntegerForeground).then();
    }
  }
}
