import iro from "@jaames/iro";
import { calculateBGRInteger, mapNumber } from "../../../shared/functions";
import { BaseReactiveChromaSDKEffect } from "./BaseReactiveChromaSDKEffect";
import { ChromaHeadsetEffectType, ChromaKeyboardEffectType, ChromaMouseEffectType } from "../RazerChromaSDKTypes";

export class VisualizerBrightnessChromaSDKEffect extends BaseReactiveChromaSDKEffect {
  protected _BGRIntegerForeground = 0;


  updateEffect(): void {
    this.createVisualizer(this.colors[0]);
  }

  createVisualizer(foregroundColor: iro.Color): void {
    foregroundColor.value = mapNumber(this.fftIntensity, 0, 255, 0, 100, true);
    this._BGRIntegerForeground = calculateBGRInteger(foregroundColor.red, foregroundColor.green, foregroundColor.blue);

    this.createKeyBoardVisualizer(this._BGRIntegerForeground);
    this.createMouseVisualizer(this._BGRIntegerForeground);
    this.createHeadsetVisualizer(this._BGRIntegerForeground);
  }

  onEntry(): void {
  }

  onExit(): void {
  }

  protected createMouseVisualizer(color: number) {
    this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, color).then();
  }


  protected createKeyBoardVisualizer(color: number) {
    this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM, color).then();
  }


  protected createHeadsetVisualizer(color: number) {
    this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, color).then();
  }
}
