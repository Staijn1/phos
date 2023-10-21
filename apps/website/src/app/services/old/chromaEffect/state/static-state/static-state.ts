import { State } from '../abstract/state';
import { calculateBGRInteger } from '../../../../../shared/functions';
import iro from '@jaames/iro';
import {
  ChromaHeadsetEffectType,
  ChromaKeyboardEffectType,
  ChromaMouseEffectType
} from "../../../../chroma-sdk/RazerChromaSDKTypes";

export class StaticState extends State {
  handle(colors: iro.Color[]): void {
    this.setStatic(colors[0]);
  }

  setStatic(color: iro.Color): void {
    const BGRColor = calculateBGRInteger(color.red, color.green, color.blue);
    this._context.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, BGRColor).then();
    this._context.createMouseEffect(ChromaMouseEffectType.CHROMA_STATIC, BGRColor).then();
    this._context.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, BGRColor).then();
  }

  onEntry(): void {
  }

  onExit(): void {
  }
}
