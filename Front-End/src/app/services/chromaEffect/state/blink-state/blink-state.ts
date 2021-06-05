import {State} from '../abstract/state';
import {iroColorObject} from '../../../../shared/types/types';
import {calculateBGRInteger} from '../../../../shared/functions';

export class BlinkState extends State {
    blinkEffect;
    counter = 0;

    handle(colors: iroColorObject[]): void {
        clearInterval(this.blinkEffect);
        this.blinkEffect = undefined;
        this.setBlink(colors[0], colors[1]);
    }

    setBlink(color: iroColorObject, backgroundColor: iroColorObject): void {
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

    setStatic(color: iroColorObject): void {
        const BGRColor = calculateBGRInteger(color.red, color.green, color.blue);
        this._context.createKeyboardEffect('CHROMA_STATIC', BGRColor).then();
        this._context.createMouseEffect('CHROMA_STATIC', BGRColor).then();
        this._context.createHeadsetEffect('CHROMA_STATIC', BGRColor).then();
    }

    setBGRStatic(BGRColor: number): void {
        this._context.createKeyboardEffect('CHROMA_STATIC', BGRColor).then();
        this._context.createMouseEffect('CHROMA_STATIC', BGRColor).then();
        this._context.createHeadsetEffect('CHROMA_STATIC', BGRColor).then();
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
