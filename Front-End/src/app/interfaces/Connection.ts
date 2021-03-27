import {iroColorObject} from '../types/types';

export abstract class Connection {
    abstract setMode(mode: number): void;

    protected abstract send(command: string): void;

    abstract setLeds(amount: number): void;

    abstract setColor(colors: iroColorObject[]): void;

    abstract decreaseBrightness(): void;

    abstract increaseBrightness(): void;

    abstract decreaseSpeed(): void;

    abstract increaseSpeed(): void;
}
