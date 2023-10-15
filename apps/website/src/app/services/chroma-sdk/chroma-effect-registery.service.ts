import { BaseChromaSDKEffect } from "./effects/BaseChromaSDKEffect";

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
  static registerEffect(mode: number, effectClass: BaseChromaSDKEffect) {
    this.EFFECTS.set(mode, effectClass);
  }
}
