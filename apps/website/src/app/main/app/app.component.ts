import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MessageService } from '../../services/message-service/message.service';
import { ThemeService } from '../../services/theme/theme.service';
import { Message } from '../../shared/types/Message';
import { swipeRight } from '@angulon/ui';
import * as AOS from 'aos';
import { debounceTime } from 'rxjs';
import { UserPreferences } from '../../shared/types/types';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  animations: [swipeRight],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(readonly updates: SwUpdate, public errorService: MessageService, private theme: ThemeService, private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
    // Subscribe to all changes in the user preferences so we can write the current state to local storage
    store.select('userPreferences')
      .pipe(debounceTime(500))
      .subscribe(preferences => {
        delete preferences.visualizerOptions.onCanvasDraw;
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
      });

    this.theme.loadTheme();

    // Service worker update, but only in production. During development, the service worker is disabled which results in an error.
    // Enabling the service worker would result in a lot of caching, which is not desired during development because it would be hard to test changes.
    if (updates.isEnabled) {
      updates.checkForUpdate().then((hasUpdate) => {
        if (hasUpdate) {
          this.errorService.setMessage(new Message('info', 'New update available! Click here to update.', () => this.update()));
        }
      });
    }
  }

  update() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

  onAlertClick(error: Message) {
    if (!error.action) return;
    error.action();
  }

  ngOnInit(): void {
    AOS.init();
  }
}
