import { inject, Injectable } from "@angular/core";
import { MessageService } from "../message-service/message.service";
import { Store } from "@ngrx/store";
import { UserPreferences } from "../../shared/types/types";
import { combineLatest, debounceTime, distinctUntilChanged, map } from "rxjs";
import {
  ChromaHeadsetEffectType,
  ChromaKeyboardEffectType,
  ChromaMouseEffectType,
} from "./RazerChromaSDKResponse";
import { ClientSideLedstripState } from "@angulon/interfaces";
import { BaseChromaSDKEffect } from "./effects/BaseChromaSDKEffect";
import { ChromaEffectRegistery } from "./chroma-effect-registery.service";
import { StaticChromaSDKEffect } from "./effects/StaticChromaSDKEffect";
import { BaseReactiveChromaSDKEffect } from "./effects/BaseReactiveChromaSDKEffect";
import { VisualizerChromaSDKEffect } from "./effects/VisualizerChromaSDKEffect";
import { visualizerModeId } from "../../shared/constants";
import { VisualizerBrightnessChromaSDKEffect } from "./effects/VisualizerBrightnessChromaSDKEffect";

/**
 * Base class for Razer Chroma SDK integrations. With this integration, we can control the RGB lights on Razer peripherals.
 * The Razer chroma SDK provides two types of connections: REST API & WebSocket.
 * To abstract away the connection type, this class provides a common interface for both types of connections, with some common methods already implemented.
 */
@Injectable({ providedIn: "root" })
export abstract class BaseChromaConnection {
  protected readonly messageService = inject(MessageService);
  protected readonly store: Store<{
    userPreferences: UserPreferences,
    ledstripState: ClientSideLedstripState
  }> = inject(Store);

  protected readonly APPLICATION_DATA = {
    title: "Phos",
    description: "Integrates with the Phos LED control application",
    author: {
      name: "Stein Jonker (Staijn)",
      contact: "https://github.com/Staijn1/angulon"
    },
    device_supported: [
      "keyboard"
    ],
    category: "application"
  };
  protected isInitialized = false;
  protected activeEffect: BaseChromaSDKEffect | undefined;

  set intensity(value: number) {
    if (
      !(this.activeEffect instanceof BaseReactiveChromaSDKEffect) ||
      !this.isInitialized ||
      this.activeEffect.colors.length == 0) return;
    this.activeEffect.fftIntensity = value;
  }

  constructor() {
    // Subscribes to changes in the user preferences to receive changes in the Chroma SDK setting.
    // Also subscribes to changes in the LED strip state to receive changes in the mode.
    // That way we can initialize/uninitialize the Chroma SDK when the setting is changed,
    // and also look up the associated effect for the selected mode and activate it immediately.
    combineLatest([
      this.store.select("userPreferences").pipe(
        map(preferences => preferences.settings.chromaSupportEnabled),
        distinctUntilChanged()
      ),
      this.store.select("ledstripState").pipe(
        map(state => state.mode),
        distinctUntilChanged()
      ),
      this.store.select("ledstripState").pipe(
        map(state => state.colors),
        distinctUntilChanged(),
        debounceTime(20)
      )
    ])
      .subscribe(([isChromaSupportEnabled, mode, colors]) => {
        this.toggleChromaSupport(isChromaSupportEnabled)
          .then(() => {
            if (!isChromaSupportEnabled) return;

            const effect = ChromaEffectRegistery.getAssociatedEffectForMode(mode);
            if (effect) {
              this.activeEffect?.onExit();
              this.activeEffect = effect;
              this.activeEffect.colors = colors;
              this.activeEffect.onEntry();
            }
          });
      });

    this.registerEffects();
  }

  /**
   * Registers all effects with the {@link ChromaEffectRegistery}
   * @private
   */
  private registerEffects() {
    ChromaEffectRegistery.registerEffect(0, new StaticChromaSDKEffect(this));
    ChromaEffectRegistery.registerEffect(visualizerModeId, new VisualizerChromaSDKEffect(this));
    ChromaEffectRegistery.registerEffect(visualizerModeId + 1, new VisualizerBrightnessChromaSDKEffect(this));
  }

  /**
   * If the chroma SDK setting is disabled, this function will destroy the connection to Razer if it was already set up.
   * If the setting is enabled, the connection to the Razer Chroma SDK will be set up.
   */
  protected async toggleChromaSupport(chromaSupportEnabled: boolean): Promise<void> {
    if (chromaSupportEnabled && !this.isInitialized) {
      await this.initialize();
      this.isInitialized = true;
    } else if (this.isInitialized && !chromaSupportEnabled) {
      await this.unInitialize();
      this.isInitialized = false;
    }
  }

  /**
   * Implement this method to register this application with the Razer SDK and set up the connection
   */
  protected abstract initialize(): Promise<void>;

  /**
   * Implement this method to uninitialize the Chroma SDK
   */
  abstract unInitialize(): Promise<void>;

  /**
   * Returns the URL to the Razer Chroma SDK
   */
  abstract getChromaSDKUrl(): string;

  /**
   * Executes an endpoint
   * @param endpoint
   * @param payload
   */
  abstract call(endpoint: string, payload: unknown): Promise<unknown>;

  /**
   * Construct the payload for the keyboard effect
   * Must be async because overriding methods create API calls
   * @param effect
   * @param payload Please refer to the Razer Chroma SDK documentation for the payload structure {@link https://assets.razerzone.com/dev_portal/REST/html/md__r_e_s_t_external_03_keyboard.html}
   */
  createKeyboardEffect(effect: ChromaKeyboardEffectType, payload: any):RazerChromaSDKTypes {
    if (effect === ChromaKeyboardEffectType.CHROMA_NONE) {
      return { effect };
    } else if (effect === ChromaKeyboardEffectType.CHROMA_CUSTOM && typeof payload === "object") {
      return { effect, param: payload };
    } else if (effect === ChromaKeyboardEffectType.CHROMA_STATIC && typeof payload === "number") {
      return { effect, param: { color: payload } };
    } else if (effect === ChromaKeyboardEffectType.CHROMA_CUSTOM_KEY && typeof payload === "object") {
      return { effect, param: payload };
    } else {
      throw new Error(`The effect ${effect} with the received payload is not supported`);
    }
  }


  /**
   * Construct the payload for the mouse effect
   */
  createMouseEffect(effect: ChromaMouseEffectType, data: any): Record<string, unknown> {
    if (effect === ChromaMouseEffectType.CHROMA_NONE) {
      return { effect };
    } else if (effect === ChromaMouseEffectType.CHROMA_CUSTOM2 && typeof data === "object") {
      return { effect, param: data };
    } else if (effect === ChromaMouseEffectType.CHROMA_STATIC && typeof data === "number") {
      const color = { color: data };
      return { effect, param: color };
    } else {
      throw new Error(`The effect ${effect} with the received payload is not supported`);
    }
  }

  /**
   * Construct the payload for the headset effect
   * @param effect
   * @param data
   */
  createHeadsetEffect(effect: ChromaHeadsetEffectType, data: any): Record<string, unknown> {
    if (effect === ChromaHeadsetEffectType.CHROMA_NONE) {
      return { effect };
    } else if (effect === ChromaHeadsetEffectType.CHROMA_CUSTOM && Array.isArray(data)) {
      return { effect, param: data };
    } else if (effect === ChromaHeadsetEffectType.CHROMA_STATIC && typeof data === "number") {
      const color = { color: data };
      return { effect, param: color };
    } else if (effect === ChromaHeadsetEffectType.CHROMA_CUSTOM_KEY && typeof data === "object") {
      return { effect, param: data };
    } else {
      throw new Error(`The effect ${effect} with the received payload is not supported`);
    }
  }

  async setEffectsForDevices(effects: {
    keyboard?: Record<string, unknown>;
    mouse?: Record<string, unknown>;
    headset?: Record<string, unknown>
  }): Promise<void> {
    const promises = [];
    if (effects.keyboard) promises.push(this.call("keyboard", effects.keyboard));
    if (effects.mouse) promises.push(this.call("mouse", effects.mouse));
    if (effects.headset) promises.push(this.call("headset", effects.headset));

    await Promise.all(promises);
  }
}
