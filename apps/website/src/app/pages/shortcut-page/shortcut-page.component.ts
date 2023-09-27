import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/message-service/message.service';
import { Store } from '@ngrx/store';
import { LedstripState } from '@angulon/interfaces';
import { combineLatest } from 'rxjs';
import { WebsocketServiceNextGen } from '../../services/websocketconnection/websocket-nextgen.service';
import {
  DecreaseLedstripBrightness,
  DecreaseLedstripSpeed,
  IncreaseLedstripBrightness,
  IncreaseLedstripSpeed
} from '../../../redux/ledstrip/ledstrip.action';

@Component({
  selector: 'app-shortcut-page',
  templateUrl: './shortcut-page.component.html',
  styleUrls: ['./shortcut-page.component.scss']
})
export class ShortcutPageComponent {
  private static wasShortcutActivated = false;

  /**
   * From the query parameters we will read the shortcut to execute
   */
  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private connection: WebsocketServiceNextGen,
              private router: Router,
              private store: Store<{ ledstripState: LedstripState | undefined }>) {
    combineLatest([this.activatedRoute.queryParams, this.store.select('ledstripState')])
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
          this.store.dispatch(new IncreaseLedstripBrightness());
          break;
        case 'decreaseBrightness':
          this.store.dispatch(new DecreaseLedstripBrightness());
          break;
        case 'increaseSpeed':
          this.store.dispatch(new IncreaseLedstripSpeed());
          break;
        case 'decreaseSpeed':
          this.store.dispatch(new DecreaseLedstripSpeed());
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
