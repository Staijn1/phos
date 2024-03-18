import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MessageService } from '../../services/message-service/message.service';
import { Store } from '@ngrx/store';
import { RoomState } from '@angulon/interfaces';
import { combineLatest } from 'rxjs';
import { WebsocketService } from '../../services/websocketconnection/websocket.service';
import {
  DecreaseRoomBrightness,
  DecreaseRoomSpeed,
  IncreaseRoomBrightness,
  IncreaseRoomSpeed
} from '../../../redux/roomstate/roomstate.action';

@Component({
  selector: "app-shortcut-page",
  templateUrl: "./shortcut-page.component.html",
  styleUrls: ["./shortcut-page.component.scss"],
  imports: [
    RouterLink
  ],
  standalone: true
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
              private store: Store<{ networkState: RoomState | undefined }>) {
    combineLatest([this.activatedRoute.queryParams, this.store.select('networkState')])
      .subscribe(([params, state]) => {
        if (!state) return;

        this.executeShortcut(params['action']);
      });
  }

  private executeShortcut(param: string | undefined) {
    if (!param) return;
    if (!ShortcutPageComponent.wasShortcutActivated) {
      ShortcutPageComponent.wasShortcutActivated = true;
      switch (param) {
        case 'turnOff':
          this.connection.turnOff();
          break;
        case 'increaseBrightness':
          this.store.dispatch(new IncreaseRoomBrightness());
          break;
        case 'decreaseBrightness':
          this.store.dispatch(new DecreaseRoomBrightness());
          break;
        case 'increaseSpeed':
          this.store.dispatch(new IncreaseRoomSpeed());
          break;
        case 'decreaseSpeed':
          this.store.dispatch(new DecreaseRoomSpeed());
          break;
        default:
          this.messageService.setMessage(new Error('Shortcut not found'));
      }
    }
    // After the action just redirect to the home page
    this.router.navigateByUrl('/home')
      .catch(reason => this.messageService.setMessage(reason))
      .finally(() => ShortcutPageComponent.wasShortcutActivated = false);
  }
}
