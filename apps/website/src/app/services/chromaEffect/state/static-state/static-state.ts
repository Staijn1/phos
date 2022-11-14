import {State} from '../abstract/state'
import {calculateBGRInteger} from '../../../../shared/functions'
import iro from '@jaames/iro'

export class StaticState extends State {
  handle(colors: iro.Color[]): void {
    this.setStatic(colors[0])
  }

  setStatic(color: iro.Color): void {
    const BGRColor = calculateBGRInteger(color.red, color.green, color.blue)
    this._context.createKeyboardEffect('CHROMA_STATIC', BGRColor).then()
    this._context.createMouseEffect('CHROMA_STATIC', BGRColor).then()
    this._context.createHeadsetEffect('CHROMA_STATIC', BGRColor).then()
  }

  onEntry(): void {
  }

  onExit(): void {
  }
}
