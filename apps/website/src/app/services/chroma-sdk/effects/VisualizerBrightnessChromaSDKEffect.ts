import iro from "@jaames/iro";
import { calculateBGRInteger, mapNumber } from "../../../shared/functions";
import { BaseReactiveChromaSDKEffect } from "./BaseReactiveChromaSDKEffect";
import { ChromaHeadsetEffectType, ChromaKeyboardEffectType, ChromaMouseEffectType } from "../RazerChromaSDKResponse";

export class VisualizerBrightnessChromaSDKEffect extends BaseReactiveChromaSDKEffect {
  protected _BGRIntegerForeground = 0;


  updateEffect(): void {
    this.createVisualizer(new iro.Color(this.colors[0]));
  }

  createVisualizer(color: iro.Color): void {
    color.value = mapNumber(this.fftIntensity, 0, 255, 0, 100, true);
    this._BGRIntegerForeground = calculateBGRInteger(color.red, color.green, color.blue);

    this.createKeyBoardVisualizer(this._BGRIntegerForeground);
    this.createMouseVisualizer(this._BGRIntegerForeground);
    this.createHeadsetVisualizer(this._BGRIntegerForeground);
  }

  onEntry(): void {
  }

  onExit(): void {
  }

  protected createMouseVisualizer(color: number) {
    this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_STATIC, color).then();
  }


  protected createKeyBoardVisualizer(color: number) {
    this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, color).then();
  }


  protected createHeadsetVisualizer(color: number) {
    this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, color).then();
  }
}
