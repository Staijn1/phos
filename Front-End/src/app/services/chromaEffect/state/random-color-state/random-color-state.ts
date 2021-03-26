import {State} from '../abstract/state';
import {iroColorObject} from '../../../../types/types';
import {color_wheel, get_random_wheel_index} from '../../../../shared/functions';

export class RandomColorState extends State {

    effectInterval;
    counter = 0;
    private random = 0;

    handle(colors: iroColorObject[]): void {
        clearInterval(this.effectInterval);
        this.effectInterval = undefined;
        this.effectInterval = setInterval(() => {
            this.createEffect();
        }, this._context.speed);
    }

    onEntry(): void {
        clearInterval(this.effectInterval);
        this.effectInterval = undefined;
    }

    onExit(): void {
        clearInterval(this.effectInterval);
        this.effectInterval = undefined;
    }

    private createEffect(): void {
        this.random = get_random_wheel_index(this.random); // aux_param will store our random color wheel index
        const color = color_wheel(this.random);
        this.fill(this._context.keyboardColors, color);
        this.fill(this._context.mouseColors, color);
        this._context.createKeyboardEffect('CHROMA_STATIC', color).then();
        this._context.createHeadsetEffect('CHROMA_STATIC', color).then();
        this._context.createMouseEffect('CHROMA_STATIC', color).then();
    }

    private fill(colorArray: number[][], color: number): void {
        // tslint:disable-next-line:prefer-for-of
        for (let row = 0; row < colorArray.length; row++) {
            for (let column = 0; column < colorArray[0].length; column++) {
                colorArray[row][column] = color;
            }
        }
    }
}
