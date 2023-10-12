import { State } from '../abstract/state';
import { calculateBGRInteger, mapNumber } from '../../../../../shared/functions';
import iro from '@jaames/iro';
import { HeadsetEffect, KeyboardEffect, MouseEffect } from '../../../chromaSDK/old-chroma-s-d-k.service';

export class VisualizerBrightnessState extends State {
  protected _BGRIntegerForeground = 0;
  protected _previousBGRIntegerForeground!: number;
  private counter = 0;

  protected _intensity = 0;

  set intensity(value: number) {
    this._intensity = value;
  }

  handle(colors: iro.Color[]): void {
    if (!colors) return;
    this.createVisualizer(new iro.Color(colors[0]));
    this.counter++;
    this.counter = this.counter % 100;
  }

  createVisualizer(foregroundColor: iro.Color): void {
    foregroundColor.value = mapNumber(this._intensity, 0, 1, 0, 100, true);
    this._BGRIntegerForeground = calculateBGRInteger(foregroundColor.red, foregroundColor.green, foregroundColor.blue);

    // Nothing changed so let's not waste resources to set the same effect again.
    if (this._BGRIntegerForeground == this._previousBGRIntegerForeground) return;
    if (this.counter % 5 != 0) return;
    this._previousBGRIntegerForeground = this._BGRIntegerForeground;
    this.createHeadsetVisualizer();
    this.createKeyBoardVisualizer();
    this.createMouseVisualizer();
  }

  onEntry(): void {
  }

  onExit(): void {
  }

  protected createMouseVisualizer() {
    this._context.createMouseEffect(MouseEffect.CHROMA_STATIC, this._BGRIntegerForeground).then();
  }

  protected createKeyBoardVisualizer() {
    this._context.createKeyboardEffect(KeyboardEffect.CHROMA_STATIC, this._BGRIntegerForeground).then();
  }

  protected createHeadsetVisualizer() {
    this._context.createHeadsetEffect(HeadsetEffect.CHROMA_STATIC, this._BGRIntegerForeground).then();
  }
}
