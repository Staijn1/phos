
import iro from "@jaames/iro";
import { BaseChromaSDKEffect } from "./BaseChromaSDKEffect";
import { calculateBGRInteger } from "../../../shared/functions";
import { ChromaKeyboardEffectType } from "../../old/chromaSDK/old-chroma-s-d-k.service";

export class StaticChromaSDKEffect extends BaseChromaSDKEffect {
  setStatic(color: iro.Color): void {
    const BGRColor = calculateBGRInteger(color.red, color.green, color.blue);
    // @ts-ignore
    this.connection.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC).then();
  }

  onEntry(): void {
  }

  onExit(): void {
  }

  updateEffect(colors: iro.Color[]): void {
    this.setStatic(colors[0]);
  }
}
