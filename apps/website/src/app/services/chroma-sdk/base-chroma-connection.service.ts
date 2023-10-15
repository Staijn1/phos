import { inject, Injectable } from "@angular/core";
import { MessageService } from "../message-service/message.service";
import { Store } from "@ngrx/store";
import { UserPreferences } from "../../shared/types/types";
import { distinctUntilChanged, map } from "rxjs";
import { ChromaKeyboardEffectType } from "../old/chromaSDK/old-chroma-s-d-k.service";
import { RazerChromaSDKTypes } from "./RazerChromaSDKTypes";
import { ClientSideLedstripState } from "@angulon/interfaces";
import { BaseChromaSDKEffect } from "./effects/BaseChromaSDKEffect";
import { ChromaEffectRegistery } from "./chroma-effect-registery.service";

/**
 * Base class for Razer Chroma SDK integrations. With this integration we can control the RGB lights on Razer peripherals.
 * The Razer chroma SDK provides two types of connections: REST API & WebSocket.
 * To abstract away the connection type, this class provides a common interface for both types of connections, with some common methods already implemented.
 */
@Injectable({ providedIn: "root" })
export abstract class BaseChromaConnection {
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

  protected readonly messageService = inject(MessageService);
  protected readonly store: Store<{ userPreferences: UserPreferences, ledstripState: ClientSideLedstripState }> = inject(Store);
  protected heartbeatInterval: NodeJS.Timer | undefined;
  protected isInitialized = false;
  protected activeEffect: BaseChromaSDKEffect | undefined;

  constructor() {
    // Subscribes to changes in the user preferences to receive changes in the Chroma SDK setting
    this.store.select("userPreferences")
      .pipe(
        map(preferences => preferences.settings.chromaSupportEnabled),
        distinctUntilChanged()
      ).subscribe(chromaSupportEnabled => {
      this.toggleChromaSupport(chromaSupportEnabled);
    });

    this.store.select("ledstripState").pipe(
      map(state => state.mode),
      distinctUntilChanged()
    ).subscribe(mode => {
      const effect = ChromaEffectRegistery.getAssociatedEffectForMode(mode);
      if (effect) this.activeEffect = effect;
    });

    this.store.select("ledstripState").pipe(
      map(state => state.colors),
      distinctUntilChanged()
    ).subscribe(colors => {
      if (this.activeEffect) {
        this.activeEffect.updateEffect(colors);
      }
    });
  }

  /**
   * If the chroma SDK setting is disabled this function will destroy the connection to Razer if it was already set up.
   * If the setting is enabled the connection to the Razer Chroma SDK will be set up.
   */
  private toggleChromaSupport(chromaSupportEnabled: boolean): void {
    if (chromaSupportEnabled && !this.isInitialized) {
      this.initialize()
        .then(() => this.startHeartbeat())
        .catch(e => this.messageService.setMessage(e));
    } else if (this.isInitialized) {
      this.unInitialize()
        .then(() => clearInterval(this.heartbeatInterval))
        .catch(e => this.messageService.setMessage(e));
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
   * Implement this method to keep the connection alive with the Razer SDK
   */
  abstract performHeartbeat(): Promise<void>

  /**
   * Executes an endpoint
   * @param endpoint
   * @param payload
   */
  abstract call(endpoint: string, payload: unknown): Promise<unknown>;

  /**
   * After initializing, the connection should send a heartbeat to the Razer SDK every {@link HEARTBEAT_INTERVAL_MS} milliseconds.
   * This method starts the interval that sends the heartbeat
   * Also see {@link performHeartbeat}
   * @private
   */
  private startHeartbeat(): void {
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      // Perform the heartbet and if it fails, try to restart the connection
      this.performHeartbeat()
        .catch(e => {
          // Attempt to restart the connection when the connection fails
          this.unInitialize().then(() => this.toggleChromaSupport(true));
        }).catch(e => {
        this.messageService.setMessage({
          message: "Failed to perform ChromaSDK Heartbeat. Is Razer Synapse still running?",
          name: "CHROMA_SDK_HEARTBEAT_FAILED"
        });
        console.error(e);
      });
    }, this.HEARTBEAT_INTERVAL_MS);
  }

  /**
   * Returns a value in milliseconds for how often the heartbeat should be sent to the Razer SDK (see  {@link performHeartbeat})
   * If this value is too high, the connection will be lost
   * If this value is too low, the Razer SDK will consume more resources than necessary
   * In case the default value needs overriding, override this method in the child class
   */
  protected get HEARTBEAT_INTERVAL_MS(): number {
    return 5000;
  }

  /**
   * Construct the payload for the keyboard effect
   * @param effect
   * @param payload Please refer to the Razer Chroma SDK documentation for the payload structure {@link https://assets.razerzone.com/dev_portal/REST/html/md__r_e_s_t_external_03_keyboard.html}
   * @protected
   */
  createKeyboardEffect(effect: ChromaKeyboardEffectType, payload: any): RazerChromaSDKTypes {
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

  /*  async createMouseEffect(effect: MouseEffect, data: any): Promise<any> {
      if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
        return;
      }
      let jsonObj;

      if (effect === 'CHROMA_NONE') {
        jsonObj = JSON.stringify({ effect });
      } else if (effect === 'CHROMA_CUSTOM2') {
        jsonObj = JSON.stringify({ effect, param: data });
      } else if (effect === 'CHROMA_STATIC') {
        const color = { color: data };
        jsonObj = JSON.stringify({ effect, param: color });
      }

      const response = await fetch(`${this.initializedApiURL}/mouse`, {
        method: 'PUT',
        body: jsonObj,
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });

      if (!response.ok) {
        throw new Error('error! ' + response.status);
      }
      return response.json();
    }

    async createHeadsetEffect(effect: HeadsetEffect, data: any): Promise<any> {
      let jsonObj;

      if (effect === 'CHROMA_NONE') {
        jsonObj = JSON.stringify({ effect });
      } else if (effect === 'CHROMA_CUSTOM') {
        jsonObj = JSON.stringify({ effect, param: data });
      } else if (effect === 'CHROMA_STATIC') {
        const color = { color: data };
        jsonObj = JSON.stringify({ effect, param: color });
      } else if (effect === 'CHROMA_CUSTOM_KEY') {
        jsonObj = JSON.stringify({ effect, param: data });
      }

      const response = await fetch(`${this.initializedApiURL}/headset`, {
        method: 'PUT',
        body: jsonObj,
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });

      if (!response.ok) {
        throw new Error('error! ' + response.status);
      }
      return response.json();
    }*/
}
