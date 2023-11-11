import iro from "@jaames/iro";
import { calculateBGRInteger, mapNumber } from "../../../shared/functions";
import { BaseReactiveChromaSDKEffect } from "./BaseReactiveChromaSDKEffect";
import { ChromaHeadsetEffectType, ChromaKeyboardEffectType, ChromaMouseEffectType } from "../RazerChromaSDKTypes";

export class VisualizerBrightnessChromaSDKEffect extends BaseReactiveChromaSDKEffect {
  protected _BGRIntegerForeground = 0;


  updateEffect(): void {
    this.createVisualizer(new iro.Color(this.colors[0]));
  }

  createVisualizer(color: iro.Color): void {
    color.value = mapNumber(this.fftIntensity, 0, 255, 0, 100, true);
    this._BGRIntegerForeground = calculateBGRInteger(color.red, color.green, color.blue);

    const keyboardEffect = this.createKeyBoardVisualizer(this._BGRIntegerForeground);
    const mouseEffect = this.createMouseVisualizer(this._BGRIntegerForeground);
    const headsetEffect = this.createHeadsetVisualizer(this._BGRIntegerForeground);

    this.connection.setEffectsForDevices({
      keyboard: keyboardEffect,
      mouse: mouseEffect,
      headset: headsetEffect
    }).then();
  }

  onEntry(): void {
  }

  onExit(): void {
  }

  protected createMouseVisualizer(color: number) {
    return this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_STATIC, color);
  }


  protected createKeyBoardVisualizer(color: number) {
    return this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, color);
  }


  protected createHeadsetVisualizer(color: number) {
    return this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, color);
  }
}
