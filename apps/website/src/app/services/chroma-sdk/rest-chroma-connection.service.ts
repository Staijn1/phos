import {Injectable} from '@angular/core';
import {ChromaConnection} from "./ChromaConnection";
import {MessageService} from "../message-service/message.service";
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class RestChromaConnectionService extends ChromaConnection {
  private isInitialized = false;
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
    const response = await this.call("/razer/chromasdk", {
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

  uninitialize(): Promise<void> {
    return Promise.resolve(undefined);
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
