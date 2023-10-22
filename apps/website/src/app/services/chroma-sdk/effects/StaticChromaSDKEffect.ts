import iro from "@jaames/iro";
import { BaseChromaSDKEffect } from "./BaseChromaSDKEffect";
import { calculateBGRInteger } from "../../../shared/functions";
import { ChromaHeadsetEffectType, ChromaKeyboardEffectType, ChromaMouseEffectType } from "../RazerChromaSDKResponse";

export class StaticChromaSDKEffect extends BaseChromaSDKEffect {
  onEntry(): void {
  }

  onExit(): void {
  }

  updateEffect(): void {
    this.setStatic(this.colors[0]);
  }

  setStatic(color: iro.Color): void {
    const BGRColor = calculateBGRInteger(color.red, color.green, color.blue);
    this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, BGRColor);
    this.connection.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, BGRColor);
    this.connection.createMouseEffect(ChromaMouseEffectType.CHROMA_STATIC, BGRColor);
  }
}
