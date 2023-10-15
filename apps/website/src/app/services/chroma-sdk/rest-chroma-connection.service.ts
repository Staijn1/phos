import {Injectable} from '@angular/core';
import {BaseChromaConnection} from "./base-chroma-connection.service";
import {ChromaKeyboardEffectType} from "../old/chromaSDK/old-chroma-s-d-k.service";
import {RazerChromaSDKTypes} from "./RazerChromaSDKTypes";

@Injectable({
  providedIn: 'root'
})
export class RestChromaConnectionService extends BaseChromaConnection {
  private initializedURL: string | undefined;

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

    this.initializedURL = response.uri;
    this.isInitialized = true;

    await this.createKeyboardEffect(ChromaKeyboardEffectType.CHROMA_STATIC, 255);
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
    // print callstack
    console.trace();

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
}
