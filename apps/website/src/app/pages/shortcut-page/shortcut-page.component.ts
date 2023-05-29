import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MessageService} from '../../services/message-service/message.service';
import {WebsocketService} from "../../services/websocketconnection/websocket.service";

@Component({
  selector: 'app-shortcut-page',
  templateUrl: './shortcut-page.component.html',
  styleUrls: ['./shortcut-page.component.scss'],
})
export class ShortcutPageComponent {
  /**
   * From the query parameters we will read the shortcut to execute
   */
  constructor(private activatedRoute: ActivatedRoute, private messageService: MessageService, private connection: WebsocketService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.executeShortcut(params['shortcut']);
    });
  }

  private executeShortcut(param: string | undefined) {
    if (!param) return;

    switch (param) {
      case "turnOff":
        console.log("Turning off");
        this.connection.turnOff();
        break;
      case "increaseBrightness":
        console.log("Increasing brightness");
        this.connection.increaseBrightness()
        break;
      case "decreaseBrightness":
        console.log("Decreasing brightness");
        this.connection.decreaseBrightness()
        break;
      case "increaseSpeed":
        console.log("Increasing speed");
        this.connection.increaseSpeed();
        break;
      case "decreaseSpeed":
        console.log("Decreasing speed");
        this.connection.decreaseSpeed();
        break;
      default:
        this.messageService.setMessage(new Error("Shortcut not found"))
    }
  }
}
