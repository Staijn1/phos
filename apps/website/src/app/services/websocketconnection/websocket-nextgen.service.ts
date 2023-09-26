import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { MessageService } from "../message-service/message.service";
import { io, Socket } from "socket.io-client";
import { LedstripState } from "@angulon/interfaces";
import { Store } from "@ngrx/store";
import { ReceiveLedstripState } from "../../../redux/ledstrip/ledstrip.action";
import { debounceTime } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class WebsocketServiceNextGen {
  private websocketUrl = environment.url;
  private socket: Socket;
  private updateLedstripState = true;

  constructor(
    private messageService: MessageService,
    private readonly store: Store<{ ledstripState: LedstripState }>
  ) {
    // When the ledstrip state changes, and it was not this class that triggered the change, send the new state to the server
    this.store
      .select("ledstripState")
      .pipe(debounceTime(200))
      .subscribe((state) => {
        if (!this.updateLedstripState) {
          this.updateLedstripState = true;
          return;
        }

        if (!this.socket || this.socket.disconnected) {
          return;
        }

        this.promisifyEmit<LedstripState>("setState", state).then();
      });

    this.socket = io(this.websocketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5
    });

    this.socket.on("connect", () => {
      console.log(`Opened websocket at`, this.websocketUrl);

      this.promisifyEmit<LedstripState>("joinUserRoom").then((state) => {
        this.updateLedstripState = false;
        this.store.dispatch(new ReceiveLedstripState(state));
      });
    });

    this.socket.on("disconnect", () => {
      console.log(`Disconnected from websocket at ${this.websocketUrl}`);
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error(`Failed to connect to websocket at ${this.websocketUrl}`, error);
      messageService.setMessage(error);
    });
  }


  /**
   * Changes the .emit API of the websocket to a Promise-based API, so we can await the response
   * @param eventName - The name of the event to emit
   * @param args The arguments to pass to the event
   * @returns A promise that resolves when the server responds
   * @private
   */
  private promisifyEmit<T>(eventName: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const error = new Error("Websocket response timeout exceeded");
        this.messageService.setMessage(error);
        reject(error);
      }, 3000);

      if (args.length == 1 && !Array.isArray(args[0])) {
        args = args[0];
      }
      this.socket.emit(eventName, args, (data: T) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });
  }
}
