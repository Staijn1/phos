import { State } from '../abstract/state'
import { color_wheel, randomInteger } from '../../../../shared/functions'

export class MultiDynamicState extends State {
    private headsetColors = [0, 0, 0, 0, 0];
    private interval;


    handle(): void {
        clearInterval(this.interval)
        this.interval = undefined
        this.setMultiDynamic()
    }

    setMultiDynamic(): void {
        if (this.interval === undefined) {
            this.interval = setInterval(() => {
                this.headsetEffect()
                this.keyboardEffect()
                this.mouseEffect()
            }, this._context.speed)
        }
    }

    onEntry(): void {
        this.keyboardEffect()
        this.mouseEffect()
        this.headsetEffect()
    }

    onExit(): void {
        clearInterval(this.interval)
        this.interval = undefined
    }

    private keyboardEffect(): void {
        for (let row = 0; row < this._context.keyboard.rows; row++) {
            for (let column = 0; column < this._context.keyboard.columns; column++) {
                this._context.keyboardColors[row][column] = color_wheel(randomInteger(0, 255))
            }
        }
        this._context.createKeyboardEffect('CHROMA_CUSTOM', this._context.keyboardColors).then()
    }


    private mouseEffect(): void {
        for (let row = 0; row < this._context.mouse.rows; row++) {
            for (let column = 0; column < this._context.mouse.columns; column++) {
                this._context.mouseColors[row][column] = color_wheel(randomInteger(0, 255))
            }
        }
        this._context.createMouseEffect('CHROMA_CUSTOM2', this._context.mouseColors).then()
    }

    private headsetEffect(): void {
        for (let i = 0; i < this._context.headset.amount; i++) {
            this.headsetColors[i] = color_wheel(randomInteger(0, 255))
        }
        this._context.createHeadsetEffect('CHROMA_CUSTOM', this.headsetColors).then()
    }
}
