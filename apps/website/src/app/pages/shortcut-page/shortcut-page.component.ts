import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../../services/message-service/message.service";
import {WebsocketService} from "../../services/websocketconnection/websocket.service";
import {Store} from "@ngrx/store";
import {ColorpickerState} from "../../../redux/color/color.reducer";

@Component({
  selector: "app-shortcut-page",
  templateUrl: "./shortcut-page.component.html",
  styleUrls: ["./shortcut-page.component.scss"]
})
export class ShortcutPageComponent {
  private static wasShortcutActivated = false;

  /**
   * From the query parameters we will read the shortcut to execute
   */
  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private connection: WebsocketService,
              private router: Router,
              private store: Store<{ colorpicker: ColorpickerState }>) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.executeShortcut(params["action"]);
    });
  }

  private executeShortcut(param: string | undefined) {
    if (!param) return;
    // We need to subscribe to the state of the color picker because the colors get set after the connection is established
    this.store.select("colorpicker").subscribe((state) => {
      if (!ShortcutPageComponent.wasShortcutActivated) {
        ShortcutPageComponent.wasShortcutActivated = true;
        switch (param) {
          case "turnOff":
            this.connection.turnOff();
            break;
          case "increaseBrightness":
            this.connection.increaseBrightness();
            break;
          case "decreaseBrightness":
            this.connection.decreaseBrightness();
            break;
          case "increaseSpeed":
            this.connection.increaseSpeed();
            break;
          case "decreaseSpeed":
            this.connection.decreaseSpeed();
            break;
          default:
            this.messageService.setMessage(new Error("Shortcut not found"));
        }
      }
      // After the action just redirect to the home page
      this.router.navigateByUrl("/home")
        .catch(reason => this.messageService.setMessage(reason))
        .finally(() => ShortcutPageComponent.wasShortcutActivated = false);
    });
  }
}
