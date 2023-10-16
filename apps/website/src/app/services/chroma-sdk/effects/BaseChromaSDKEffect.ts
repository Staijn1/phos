import iro from "@jaames/iro";
import { BaseChromaConnection } from "../base-chroma-connection.service";

export abstract class BaseChromaSDKEffect {
  constructor(protected connection: BaseChromaConnection) {
  }

  abstract updateEffect(colors: iro.Color[]): void;

  abstract onExit(): void;

  abstract onEntry(): void;
}
