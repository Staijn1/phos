import {Injectable} from '@angular/core';
import {BaseChromaConnection} from "./base-chroma-connection.service";
import {
  ChromaHeadsetEffectType,
  ChromaKeyboardEffectType,
  ChromaMouseEffectType,
  RazerChromaSDKTypes
} from "./RazerChromaSDKTypes";

@Injectable({
  providedIn: 'root'
})
export class RestChromaConnectionService extends BaseChromaConnection {
  private initializedURL: string | undefined;
  private heartbeatInterval: NodeJS.Timer | undefined;
  getChromaSDKUrl(): string {
    if (this.isInitialized) return this.initializedURL as string;
    return "http://localhost:54235/razer/chromasdk";
  }

  /**
   * Connects to the Razer chroma SDK and registers this application.
   * We can do this by performing a POST request to the Razer Chroma SDK with the application details
   * @see https://assets.razerzone.com/dev_portal/REST/html/index.html#uri
   */
  async initialize(): Promise<void> {
    const response = await this.call("", this.APPLICATION_DATA, {
        method: "POST",
      },
      true) as { uri: string, sessionid: string };

    this.startHeartbeat();
    this.initializedURL = response.uri;
  }

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
        .catch((e) => {
          console.warn("Failed to perform heartbeat", e);

          // Attempt to restart the connection when the connection fails
          this.unInitialize().then(() => this.toggleChromaSupport(true));
        }).catch(e => {
        console.warn("Failed to restart connection", e);
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
   * @inheritDoc
   */
  async performHeartbeat(): Promise<void> {
    await this.call("/heartbeat", undefined, {
      method: "PUT"
    });
  }

  /**
   * Stop the connection with the Razer SDK
   */
  async unInitialize(): Promise<void> {
    await this.call("", undefined, {
      method: "DELETE"
    });

    this.isInitialized = false;
    clearInterval(this.heartbeatInterval);
  }

  /**
   * Performs a REST call to the Razer Chroma SDK with some payload and returns the response
   * Contains default error handling
   * @param path The path to call, e.g. /heartbeat
   * @param payload The body of the request
   * @param requestParamsInput Specific for the REST interface. The request options, excluding the body because that is set by the payload
   * @param parseJSONResponse Specific for the REST interface. Whether to parse the response from JSON to an object and return it. Must be disabled if the response is not JSON
   */
  async call(path: string, payload: unknown, requestParamsInput?: Omit<RequestInit, 'body'>, parseJSONResponse = false): Promise<unknown> {
    const requestParams: RequestInit = {
      ...requestParamsInput,
      body: ["GET", "HEAD"].includes(requestParamsInput?.method ?? 'unknown') ? undefined : JSON.stringify(payload)
    };

    if (requestParamsInput && ["POST", "PUT", "PATCH"].includes(requestParamsInput.method?.toUpperCase() ?? "unknown")) {
      requestParams.headers = {
        ...requestParamsInput.headers,
        "Content-Type": "application/json"
      };
    }

    try {
      const response = await fetch(this.getChromaSDKUrl() + path, requestParams);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (parseJSONResponse) {
        return await response.json();
      }

      return {};
    } catch (e) {
      this.messageService.setMessage(e as Error);
      console.error(e);
      return {};
    }
  }

  /**
   * Overrides the default implementation to create the effect and then send it to the Razer Chroma SDK
   * @param effectType
   * @param keyboardData
   */
  override async createKeyboardEffect(effectType: ChromaKeyboardEffectType, keyboardData: any): Promise<RazerChromaSDKTypes> {
    const effect = await super.createKeyboardEffect(effectType, keyboardData);
    await this.call("/keyboard", effect, {method: "PUT"});

    return effect;
  }

  /**
   * Overrides the default implementation to create the effect and then send it to the Razer Chroma SDK
   * @param effectType
   * @param mouseData
   */
  override async createMouseEffect(effectType: ChromaMouseEffectType, mouseData: any): Promise<RazerChromaSDKTypes> {
    const effect = await super.createMouseEffect(effectType, mouseData);
    await this.call("/mouse", effect, {method: "PUT"});

    return effect;
  }

  /**
   * Overrides the default implementation to create the effect and then send it to the Razer Chroma SDK
   * @param effectType
   * @param headsetData
   */
  override async createHeadsetEffect(effectType: ChromaHeadsetEffectType, headsetData: any): Promise<RazerChromaSDKTypes> {
    const effect = await super.createHeadsetEffect(effectType, headsetData);
    await this.call("/headset", effect, {method: "PUT"});

    return effect;
  }
}
