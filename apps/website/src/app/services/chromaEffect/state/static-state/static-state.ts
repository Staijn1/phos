import {State} from '../abstract/state'
import {calculateBGRInteger} from '../../../../shared/functions'
import iro from '@jaames/iro'
import {HeadsetEffect, KeyboardEffect, MouseEffect} from '../../../chromaSDK/chromaSDK.service';
export class StaticState extends State {
  handle(colors: iro.Color[]): void {
    this.setStatic(colors[0])
  }

  setStatic(color: iro.Color): void {
    const BGRColor = calculateBGRInteger(color.red, color.green, color.blue)
    this._context.createKeyboardEffect(KeyboardEffect.CHROMA_STATIC, BGRColor).then()
    this._context.createMouseEffect(MouseEffect.CHROMA_STATIC, BGRColor).then()
    this._context.createHeadsetEffect(HeadsetEffect.CHROMA_STATIC, BGRColor).then()
  }

  onEntry(): void {
  }

  onExit(): void {
  }
}
