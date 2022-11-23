import iro from '@jaames/iro'

export abstract class LedstripConnection {
  abstract setMode(mode: number): void;

  abstract setLeds(amount: number): void;

  abstract setColor(colors: iro.Color[] | string[]): void;

  abstract decreaseBrightness(): void;

  abstract increaseBrightness(): void;

  abstract decreaseSpeed(): void;

  abstract increaseSpeed(): void;
}
