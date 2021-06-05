import {State} from '../abstract/state'
import {iroColorObject} from '../../../../shared/types/types'
import {calculateBGRInteger} from '../../../../shared/functions'
import {GlobalVars} from '../../../../shared/constants'

export class TheaterChaseState extends State {
    effect;
    private counter = 0;

    handle(colors: iroColorObject[]): void {
        clearInterval(this.effect)
        this.effect = setInterval(
            () => {
                this.setEffect(calculateBGRInteger(colors[0].red, colors[0].green, colors[0].blue), calculateBGRInteger(colors[1].red, colors[1].green, colors[1].blue))
            }, this._context.speed / GlobalVars.NUM_LEDS)

    }

    setLEDs(K: number, N: number, color: number): void {
        for (let i = 0; i < this._context.keyboard.columns; i++) {
            if (i % N === K) {
                this._context.keyboardColors[2][i] = color
            } else {
                this._context.keyboardColors[2][i] = 255
            } // set red LED
        }
    }

    setEffect(color: number, backgroundColor: number): void {
        const colors = [color, backgroundColor]
        this._context.createHeadsetEffect('CHROMA_STATIC', colors[(this.counter) % colors.length]).then()

        for (let row = 0; row < this._context.keyboard.rows; row++) {
            for (let i = 0; i < this._context.keyboard.columns; i++) {
                this._context.keyboardColors[row][i] = colors[(i + this.counter) % colors.length]  // mod restricts the color number
            }
        }

        for (let row = 0; row < this._context.mouse.rows; row++) {
            this._context.mouseColors[row][0] = colors[(row + this.counter) % colors.length]
            this._context.mouseColors[row][3] = colors[(row + this.counter) % colors.length]
            this._context.mouseColors[row][6] = colors[(row + this.counter) % colors.length]
        }
        this.counter = (this.counter + 1) % colors.length                // Cycle through the starting LED


        this._context.createKeyboardEffect('CHROMA_CUSTOM', this._context.keyboardColors).then()
        this._context.createMouseEffect('CHROMA_CUSTOM2', this._context.mouseColors).then()
    }

    onEntry(): void {
        this.effect = clearInterval()
        this.effect = undefined
    }

    onExit(): void {
        clearInterval(this.effect)
        this.effect = undefined
        this.counter = 0
    }
}
