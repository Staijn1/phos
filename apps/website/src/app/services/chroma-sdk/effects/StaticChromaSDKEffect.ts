import iro from "@jaames/iro";
import { BaseChromaSDKEffect } from "./BaseChromaSDKEffect";
import { calculateBGRInteger } from "../../../shared/functions";
import { ChromaKeyboardEffectType, HeadsetEffect, MouseEffect } from "../../old/chromaSDK/old-chroma-s-d-k.service";

export class StaticChromaSDKEffect extends BaseChromaSDKEffect {
  onEntry(): void {
  }

  onExit(): void {
  }

  updateEffect(colors: iro.Color[]): void {
    this.setStatic(colors[0]);
  }

  setStatic(color: iro.Color): void {
    const BGRColor = calculateBGRInteger(color.red, color.green, color.blue);
    this.connection
      .createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, BGRColor);
    this.connection.createHeadsetEffect(HeadsetEffect.CHROMA_STATIC, BGRColor);
    this.connection.createMouseEffect(MouseEffect.CHROMA_STATIC, BGRColor);
  }
}
