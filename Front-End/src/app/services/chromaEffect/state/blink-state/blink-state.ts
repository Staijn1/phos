import {State} from '../abstract/state';
import {iroColorObject} from '../../../../types/types';
import {calculateBGRInteger} from '../../../../shared/functions';

export class BlinkState extends State {
    blinkEffect;

    handle(colors: iroColorObject[]): void {
        this.blinkEffect = clearInterval();
        this.blinkEffect = undefined;
        this.setBlink(colors[0], colors[1]);
    }

    setBlink(color: iroColorObject, backgroundColor: iroColorObject): void {
        if (this.blinkEffect === undefined) {
            this.blinkEffect = setInterval(
                () => {
                    this.setStatic(color);
                    setTimeout(() => {
                        this.setBGRStatic(calculateBGRInteger(backgroundColor.red, backgroundColor.blue, backgroundColor.green));
                    }, this._context.speed / 2);
                }, this._context.speed);
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
        this.blinkEffect = clearInterval();
        this.blinkEffect = undefined;
    }

    onExit(): void {
        clearInterval(this.blinkEffect);
        this.blinkEffect = undefined;
    }
}
