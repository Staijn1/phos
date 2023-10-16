import iro from "@jaames/iro";
import { BaseChromaConnection } from "../base-chroma-connection.service";

export abstract class BaseChromaSDKEffect {
  private _colors: iro.Color[] = [];

  set colors(value: iro.Color[]) {
    this._colors = value;
    this.updateEffect();
  }

  get colors(): iro.Color[] {
    return this._colors;
  }

  constructor(protected connection: BaseChromaConnection) {
  }

  abstract updateEffect(): void;

  abstract onExit(): void;

  abstract onEntry(): void;
}
