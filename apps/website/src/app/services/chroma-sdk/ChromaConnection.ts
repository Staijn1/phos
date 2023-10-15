import {inject, Injectable, OnDestroy} from "@angular/core";
import {MessageService} from "../message-service/message.service";
import {Store} from "@ngrx/store";
import {UserPreferences} from "../../shared/types/types";
import {distinctUntilChanged, map} from "rxjs";

/**
 * Base class for Razer Chroma SDK integrations. With this integration we can control the RGB lights on Razer peripherals.
 * The Razer chroma SDK provides two types of connections: REST API & WebSocket.
 * To abstract away the connection type, this class provides a common interface for both types of connections, with some common methods already implemented.
 */
@Injectable({providedIn: 'root'})
export abstract class ChromaConnection {
  protected readonly APPLICATION_DATA = {
    "title": "Phos",
    "description": "Integrates with the Phos LED control application",
    "author": {
      "name": "Stein Jonker (Staijn)",
      "contact": "https://github.com/Staijn1/angulon"
    },
    "device_supported": [
      "keyboard"
    ],
    "category": "application"
  };

  protected readonly messageService = inject(MessageService);
  protected readonly store: Store<{ userPreferences: UserPreferences }> = inject(Store);
  protected heartbeatInterval: NodeJS.Timer | undefined;
  protected isInitialized = false;

  /**
   * Starts the connection with the Razer SDK
   */
  public start(): void {
    this.store.select("userPreferences")
      .pipe(
        map(preferences => preferences.settings.chromaSupportEnabled),
        distinctUntilChanged()
      ).subscribe(chromaSupportEnabled => {

      if (chromaSupportEnabled && !this.isInitialized) {
        this.initialize()
          .then(() => this.startHeartbeat())
          .catch(e => this.messageService.setMessage(e));
      } else if (this.isInitialized){
        this.unInitialize()
          .then(() => clearInterval(this.heartbeatInterval))
          .catch(e => this.messageService.setMessage(e));
      }
    });

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
   * After initializing, the connection should send a heartbeat to the Razer SDK every {@link HEARTBEAT_INTERVAL_MS} milliseconds.
   * This method starts the interval that sends the heartbeat
   * Also see {@link performHeartbeat}
   * @private
   */
  private startHeartbeat(): void {
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.performHeartbeat().catch(e => this.messageService.setMessage(e));
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
}
