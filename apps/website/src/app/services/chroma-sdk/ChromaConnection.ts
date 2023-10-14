import {OnDestroy} from "@angular/core";
import {MessageService} from "../message-service/message.service";

/**
 * Base class for Razer Chroma SDK integrations. With this integration we can control the RGB lights on Razer peripherals.
 * The Razer chroma SDK provides two types of connections: REST API & WebSocket.
 * To abstract away the connection type, this class provides a common interface for both types of connections, with some common methods already implemented.
 */
export abstract class ChromaConnection implements  OnDestroy {

  protected constructor(private readonly messageService: MessageService) {
    this.initialize()
      .then(() => this.startHeartbeat())
      .catch(e => this.messageService.setMessage(e));
  }

  protected heartbeatInterval: NodeJS.Timer | undefined;

  /**
   * Implement this method to register this application with the Razer SDK and set up the connection
   */
  abstract initialize(): Promise<void>;

  /**
   * Implement this method to uninitialize the Chroma SDK
   */
  abstract uninitialize(): Promise<void>;

  /**
   * Returns the URL to the Razer Chroma SDK
   */
  abstract getChromaSDKUrl(): string;

  /**
   * Implement this method to keep the connection alive with the Razer SDK
   */
  abstract performHeartbeat(): Promise<void>

  startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.performHeartbeat().catch(e => this.messageService.setMessage(e));
    }, this.HEARTBEAT_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    this.uninitialize().catch(e => this.messageService.setMessage(e));
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
