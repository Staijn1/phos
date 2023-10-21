import { State } from '../abstract/state';
import { calculateBGRInteger, color_wheel } from '../../../../../shared/functions';
import iro from '@jaames/iro';
import { ChromaKeyboardEffectType, ChromaMouseEffectType } from "../../../../chroma-sdk/RazerChromaSDKTypes";

export class RainbowCycleState extends State {
  effect: string | number | NodeJS.Timeout | undefined;
  private counter = 0;

  handle(colors: iro.Color[]): void {
    clearInterval(this.effect);
    this.effect = setInterval(
      () => {
        this.setEffect(calculateBGRInteger(colors[0].red, colors[0].green, colors[0].blue), calculateBGRInteger(colors[1].red, colors[1].green, colors[1].blue));
      }, this._context.speed / 256);

  }


  setEffect(color: number, backgroundColor: number): void {
    this.setColor(this._context.keyboardColors);
    this.setColor(this._context.mouseColors);


    this.counter = (this.counter + 1) & 0xFF;
    this._context.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM, this._context.keyboardColors).then();
    this._context.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, this._context.mouseColors).then();
  }

  onEntry(): void {
    clearInterval(this.effect);
    this.effect = undefined;
  }

  onExit(): void {
    clearInterval(this.effect);
    this.effect = undefined;
    this.counter = 0;
  }

  private setColor(colors: number[][]): void {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let row = 0; row < colors.length; row++) {
      for (let column = 0; column < colors[0].length; column++) {
        colors[row][column] = color_wheel(((column * 256 / this._context.keyboard.columns) + this.counter) & 0xFF);
      }
    }
  }
}
