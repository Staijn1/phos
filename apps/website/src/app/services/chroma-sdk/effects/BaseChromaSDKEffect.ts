import iro from "@jaames/iro";
import { BaseChromaConnection } from "../base-chroma-connection.service";
import { inject } from "@angular/core";

export abstract class BaseChromaSDKEffect {
  protected connection: BaseChromaConnection = inject(BaseChromaConnection);

  abstract updateEffect(colors: iro.Color[]): void;

  abstract onExit(): void;

  abstract onEntry(): void;
}
