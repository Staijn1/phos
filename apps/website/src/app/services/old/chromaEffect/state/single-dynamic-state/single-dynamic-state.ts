import { State } from '../abstract/state';
import { color_wheel, randomInteger } from '../../../../../shared/functions';
import { HeadsetEffect, KeyboardEffect, MouseEffect } from '../../../chromaSDK/old-chroma-s-d-k.service';

export class SingleDynamicState extends State {
  private interval: string | number | NodeJS.Timeout | undefined;
  private headsetColors = [0, 0, 0, 0, 0];


  handle(): void {
    clearInterval(this.interval);
    this.interval = undefined;
    this.setSingleDynamic();
  }

  setSingleDynamic(): void {
    if (this.interval === undefined) {
      this.interval = setInterval(() => {
        const randomKeyboardRow = randomInteger(0, this._context.keyboard.rows - 1);
        const randomKeyboardColumn = randomInteger(0, this._context.keyboard.columns - 1);
        this._context.keyboardColors[randomKeyboardRow][randomKeyboardColumn] = color_wheel(randomInteger(0, 255));
        this._context.createKeyboardEffect(KeyboardEffect.CHROMA_CUSTOM, this._context.keyboardColors).then();

        const randomMouseRow = randomInteger(0, this._context.mouse.rows - 1);
        const randomMouseColumn = randomInteger(0, this._context.mouse.columns - 1);
        this._context.mouseColors[randomMouseRow][randomMouseColumn] = color_wheel(randomInteger(0, 255));
        this._context.createMouseEffect(MouseEffect.CHROMA_CUSTOM2, this._context.mouseColors).then();

        const randomIndex = randomInteger(0, this._context.headset.amount - 1);
        this.headsetColors[randomIndex] = color_wheel(randomInteger(0, 255));
        this._context.createHeadsetEffect(HeadsetEffect.CHROMA_CUSTOM, this.headsetColors).then();
      }, this._context.speed);
    }
  }

  onEntry(): void {
    this.initKeyboard();
    this.initMouse();
    this.initHeadset();
  }

  onExit(): void {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  private initKeyboard(): void {
    for (let row = 0; row < this._context.keyboard.rows; row++) {
      for (let column = 0; column < this._context.keyboard.columns; column++) {
        this._context.keyboardColors[row][column] = color_wheel(randomInteger(0, 255));
      }
    }
  }


  private initMouse(): void {
    for (let row = 0; row < this._context.mouse.rows; row++) {
      for (let column = 0; column < this._context.mouse.columns; column++) {
        this._context.mouseColors[row][column] = color_wheel(randomInteger(0, 255));
      }
    }
  }

  private initHeadset(): void {
    for (let i = 0; i < this._context.headset.amount; i++) {
      this.headsetColors[i] = color_wheel(randomInteger(0, 255));
    }
  }
}

