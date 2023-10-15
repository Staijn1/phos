import {Injectable} from '@angular/core';
import {ChromaConnection} from "./ChromaConnection";

@Injectable({
  providedIn: 'root'
})
export class RestChromaConnectionService extends ChromaConnection {
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
    const response = await this.call("", {
        method: "POST",
        body: JSON.stringify(this.APPLICATION_DATA),
      },
      true) as { uri: string, sessionid: string };

    this.initializedURL = response.uri;
    this.isInitialized = true;
  }

  async performHeartbeat(): Promise<void> {
    await this.call("/heartbeat", {
      method: "PUT"
    });
  }

  async unInitialize(): Promise<void> {
    await this.call("", {
      method: "DELETE"
    });

    this.isInitialized = false;
  }


  /**
   * Performs a REST call to the Razer Chroma SDK with some payload and returns the response
   * Contains default error handling
   * @param path The path to call, e.g. /heartbeat
   * @param requestInit The request options
   * @param parseJSONResponse Whether to parse the response from JSON to an object
   */
  async call(path: string, requestInit: RequestInit, parseJSONResponse = false): Promise<unknown> {
    if (["POST", "PUT", "PATCH"].includes(requestInit.method?.toUpperCase() ?? "unknown") && requestInit.body) {
      requestInit.headers = {
        ...requestInit.headers,
        "Content-Type": "application/json"
      };
    }
    try {
      const response = await fetch(this.getChromaSDKUrl() + path, requestInit);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (parseJSONResponse) {
        return await response.json();
      }

      return {};
    } catch (e) {
      this.messageService.setMessage(e as Error);
      return {};
    }
  }
}
