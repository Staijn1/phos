import { State } from '../abstract/state';
import { calculateBGRInteger } from '../../../../../shared/functions';
import iro from '@jaames/iro';
import { ChromaHeadsetEffectType, ChromaKeyboardEffectType, ChromaMouseEffectType } from '../../../chromaSDK/old-chroma-s-d-k.service';

export class BlinkState extends State {
  blinkEffect: string | number | NodeJS.Timeout | undefined;
  counter = 0;

  handle(colors: iro.Color[]): void {
    clearInterval(this.blinkEffect);
    this.blinkEffect = undefined;
    this.setBlink(colors[0], colors[1]);
  }

  setBlink(color: iro.Color, backgroundColor: iro.Color): void {
    if (!this.blinkEffect) {
      this.blinkEffect = setInterval(
        () => {
          this.counter++;
          this.counter = this.counter % 2;
          if (this.counter === 0) {
            this.setStatic(color);
          } else {
            this.setStatic(backgroundColor);
          }
        }, this._context.speed / 2);
    }
  }

  setStatic(color: iro.Color): void {
    const BGRColor = calculateBGRInteger(color.red, color.green, color.blue);
    this._context.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, BGRColor).then();
    this._context.createMouseEffect(ChromaMouseEffectType.CHROMA_STATIC, BGRColor).then();
    this._context.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, BGRColor).then();
  }

  setBGRStatic(BGRColor: number): void {
    this._context.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, BGRColor).then();
    this._context.createMouseEffect(ChromaMouseEffectType.CHROMA_STATIC, BGRColor).then();
    this._context.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_STATIC, BGRColor).then();
  }

  onEntry(): void {
    clearInterval(this.blinkEffect);
    this.blinkEffect = undefined;
  }

  onExit(): void {
    clearInterval(this.blinkEffect);
    this.blinkEffect = undefined;
  }
}
