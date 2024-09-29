import { BaseChromaSDKEffect } from './effects/BaseChromaSDKEffect';
import { BaseReactiveChromaSDKEffect } from './effects/BaseReactiveChromaSDKEffect';
import { DoubleVuMeterChromaSDKEffect } from "./effects/DoubleVuMeterChromaSDKEffect";

/**
 * This class is used to link a chroma effect with a ledstrip mode.
 */
export class ChromaEffectRegistery {
  private static readonly EFFECTS: Map<number, BaseChromaSDKEffect> = new Map();

  /**
   * Returns the chroma effect associated with the given mode.
   * @param mode
   */
  static getAssociatedEffectForMode(mode: number) {
    return this.EFFECTS.get(mode);
  }

  /**
   * Associates a chroma effect with a ledstrip mode.
   * @param mode
   * @param effectClass
   */
  public static registerEffect(mode: number, effectClass: BaseChromaSDKEffect) {
    this.EFFECTS.set(mode, effectClass);
  }

  /**
   * Returns all the chroma effects that are an instance of the ReactiveEffect class.
   * @constructor
   */
  public static getAllReactiveModeIds(): number[] {
    return Array.from(this.EFFECTS.keys()).filter((key) => {
      return this.EFFECTS.get(key) instanceof BaseReactiveChromaSDKEffect;
    });
  }
}
