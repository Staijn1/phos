import { BaseChromaSDKEffect } from "./BaseChromaSDKEffect";

export abstract class BaseReactiveChromaSDKEffect extends BaseChromaSDKEffect {
  private _fftIntensity = 0;
  get fftIntensity(): number {
    return this._fftIntensity;
  }

  set fftIntensity(value: number) {
    this._fftIntensity = value;
    this.updateEffect();
  }
}
