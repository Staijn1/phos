import { State } from '../abstract/state';
import { calculateBGRInteger, ColdColor, mapNumber, qadd8, qsub8, randomInteger } from '../../../../../shared/functions';
import iro from '@jaames/iro';
import {
  ChromaHeadsetEffectType,
  ChromaKeyboardEffectType,
  ChromaMouseEffectType
} from "../../../../chroma-sdk/RazerChromaSDKTypes";

export class WaterfallState extends State {
  readonly COOLING = 55;
  readonly SPARKING = 120;
  private interval!: NodeJS.Timeout;
  private G_REVERSE_DIRECTION = false;
  private heatKeyboard: number[] = [];
  private heatMouse: number[] = [];

  constructor() {
    super();
  }

  handle(colors: iro.Color[]): void {
    if (this.interval === undefined) {
      this.interval = setInterval(() => {
        this.waterfallKeyboard();
        this.waterfallMouse();

        const headsetColors = this._context.keyboardColors[0].splice(0, this._context.headset.amount);
        this._context.createHeadsetEffect(ChromaHeadsetEffectType.CHROMA_CUSTOM, headsetColors);
      }, this._context.speed / this._context.keyboard.columns);
    }
  }

  onEntry(): void {
    // Array of temperature readings at each simulation cell
    this.heatKeyboard = [];
    for (let i = 0; i < this._context.keyboard.columns; i++) {
      this.heatKeyboard[i] = 0;
    }

    this.heatMouse = [];
    for (let i = 0; i < this._context.mouse.rows; i++) {
      this.heatMouse[i] = 0;
    }
  }

  onExit(): void {
    clearInterval(this.interval);
  }

  private waterfallKeyboard(): void {
    this.coolDown(this.heatKeyboard, this._context.keyboard.columns);
    this.driftUp(this.heatKeyboard, this._context.keyboard.columns);

    this.ignite(this.heatKeyboard, this._context.keyboard.columns, 7);

    // Step 4.  Map from heatKeyboard cells to LED colors on keyboard
    for (let i = 0; i < this._context.keyboard.rows; i++) {
      for (let j = 0; j < this._context.keyboard.columns; j++) {
        const color = ColdColor(mapNumber(this.heatKeyboard[j], 0, 255, 0, 240));
        let pixelnumber;
        if (this.G_REVERSE_DIRECTION) {
          pixelnumber = (this._context.keyboard.columns - 1) - j;
        } else {
          pixelnumber = j;
        }

        // **** modified for use with WS2812FX ****
        //    leds[pixelnumber] = color;
        // ws2812fx.setPixelColor(pixelnumber, color.red, color.green, color.blue);
        // console.log(typeof color.red);
        this._context.keyboardColors[i][pixelnumber] = calculateBGRInteger(color.r, color.g, color.b);
        // **** modified for use with WS2812FX ****
      }
    }

    this._context.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_CUSTOM, this._context.keyboardColors).then();
  }

  private waterfallMouse(): void {
    this.coolDown(this.heatMouse, this._context.mouse.rows);
    this.driftUp(this.heatMouse, this._context.mouse.rows);

    this.ignite(this.heatMouse, this._context.mouse.rows, 1);
    // Step 4.  Map from heatKeyboard cells to LED colors on keyboard
    for (let i = 0; i < this._context.mouse.rows; i++) {
      for (let j = 0; j < this._context.mouse.columns; j++) {
        const color = ColdColor(mapNumber(this.heatMouse[i], 0, 255, 0, 240));
        let pixelnumber;
        if (this.G_REVERSE_DIRECTION) {
          pixelnumber = (this._context.mouse.rows - 1) - i;
        } else {
          pixelnumber = i;
        }

        this._context.mouseColors[pixelnumber][j] = calculateBGRInteger(color.r, color.g, color.b);
      }
    }

    this._context.createMouseEffect(ChromaMouseEffectType.CHROMA_CUSTOM2, this._context.mouseColors).then();
  }

  private ignite(arrayToManipulate: number[], maxLeds: number, bottom: number): void {
    // Step 3.  Randomly ignite new 'sparks' of heat near the bottom
    if (randomInteger(0, 255) < this.SPARKING) {
      const y = randomInteger(0, bottom);
      arrayToManipulate[y] = qadd8(arrayToManipulate[y], randomInteger(160, 255));
    }
  }

  private coolDown(arrayToManipulate: number[], maxLeds: number): void {
    // Step 1.  Cool down every cell a little
    for (let i = 0; i < maxLeds; i++) {
      arrayToManipulate[i] = qsub8(arrayToManipulate[i], randomInteger(0, ((this.COOLING * 10) / maxLeds) + 2));
    }
  }

  private driftUp(arrayToManipulate: number[], maxLeds: number): void {
    // Step 2.  Heat from each cell drifts 'up' and diffuses a little
    for (let k = maxLeds - 1; k >= 2; k--) {
      arrayToManipulate[k] = (arrayToManipulate[k - 1] + arrayToManipulate[k - 2] + arrayToManipulate[k - 2]) / 3;
    }
  }
}
