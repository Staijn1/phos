import {State} from '../abstract/state';
import {iroColorObject} from '../../../../types/types';
import {calculateBGRInteger, color_wheel, RGBIntegerToArray} from '../../../../shared/functions';

export class RainbowState extends State {
    private counter = 0;
    private interval: NodeJS.Timeout;

    onExit(): void {
        this.reset();
    }

    onEntry(): void {
        // todo make init where all the 255 effects are precreated and then called in handle in interval might improve performance
        this.reset();
    }


    handle(colors: iroColorObject[]): void {
        this.reset();
        if (this.interval === undefined) {
            this.interval = setInterval(() => {
                const rgbArray = RGBIntegerToArray(color_wheel(this.counter));
                const BGRInteger = calculateBGRInteger(rgbArray[0], rgbArray[1], rgbArray[2]);
                this.counter++;
                this.counter = this.counter % 255;

                this._context.createHeadsetEffect('CHROMA_STATIC', BGRInteger).then();
                this._context.createKeyboardEffect('CHROMA_STATIC', BGRInteger).then();
                this._context.createMouseEffect('CHROMA_STATIC', BGRInteger).then();
            }, (Math.ceil(this._context.speed / 256)));
        }
    }

    private reset(): void {
        clearInterval(this.interval);
        this.interval = undefined;
        this.counter = 0;
    }
}
