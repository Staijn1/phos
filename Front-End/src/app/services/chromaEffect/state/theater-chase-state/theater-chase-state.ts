import {State} from '../abstract/state';
import {iroColorObject} from '../../../../types/types';
import {calculateBGRInteger, constrain} from '../../../../shared/functions';
import {delay} from 'rxjs/operators';
import {NUM_LEDS} from '../../../../shared/constants';

export class TheaterChaseState extends State {
    private keyboardColors = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    private mouseColors = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];

    effect;
    private counter = 0;

    handle(colors: iroColorObject[]): void {
        clearInterval(this.effect);
        this.effect = setInterval(
            () => {
                this.setEffect(calculateBGRInteger(colors[0].red, colors[0].green, colors[0].blue), calculateBGRInteger(colors[1].red, colors[1].green, colors[1].blue));
            }, this._context.speed / NUM_LEDS);

    }

    setLEDs(K: number, N: number, color: number): void {
        for (let i = 0; i < this._context.keyboard.columns; i++) {
            if (i % N === K) {
                this.keyboardColors[2][i] = color;
            } else {
                this.keyboardColors[2][i] = 255;
            } // set red LED
        }
    }

    setEffect(color: number, backgroundColor: number): void {
        const colors = [color, backgroundColor];
        this._context.createHeadsetEffect('CHROMA_STATIC', colors[(this.counter) % colors.length]).then();
        
        for (let row = 0; row < this._context.keyboard.rows; row++) {
            for (let i = 0; i < this._context.keyboard.columns; i++) {
                this.keyboardColors[row][i] = colors[(i + this.counter) % colors.length];  // mod restricts the color number
            }
        }

        for (let row = 0; row < this._context.mouse.rows; row++) {
            this.mouseColors[row][0] = colors[(row + this.counter) % colors.length];
            this.mouseColors[row][3] = colors[(row + this.counter) % colors.length];
            this.mouseColors[row][6] = colors[(row + this.counter) % colors.length];
        }
        this.counter = (this.counter + 1) % colors.length;                // Cycle through the starting LED


        this._context.createKeyboardEffect('CHROMA_CUSTOM', this.keyboardColors).then();
        this._context.createMouseEffect('CHROMA_CUSTOM2', this.mouseColors).then();
    }

    onEntry(): void {
        this.effect = clearInterval();
        this.effect = undefined;
    }

    onExit(): void {
        clearInterval(this.effect);
        this.effect = undefined;
        this.counter = 0;
    }
}
