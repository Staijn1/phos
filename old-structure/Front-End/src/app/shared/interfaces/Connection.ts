import iro from '@jaames/iro'

export abstract class Connection {
    abstract setMode(mode: number): void;

    protected abstract send(command: string): void;

    abstract setLeds(amount: number): void;

    abstract setColor(colors: iro.Color[] | string[]): void;

    abstract decreaseBrightness(): void;

    abstract increaseBrightness(): void;

    abstract decreaseSpeed(): void;

    abstract increaseSpeed(): void;
}
