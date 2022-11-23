import {Component} from '@angular/core'
import {SwUpdate} from '@angular/service-worker'
import {ErrorService} from '../../services/error/error.service'
import {ThemeService} from '../../services/theme/theme.service';
import {environment} from '../../../environments/environment';
import {Message} from '../../messages/Message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(readonly updates: SwUpdate, public errorService: ErrorService, private theme: ThemeService) {
    this.theme.loadTheme();

    // Service worker update, but only in production. During development, the service worker is disabled which results in an error.
    // Enabling the service worker would result in a lot of caching, which is not desired during development because it would be hard to test changes.
    if (environment.production) {
      updates.checkForUpdate().then(() => {
        this.errorService.setError(new Message('info', 'New update available! Click here to update.', () => this.update()))
      })
    }
  }

  update() {
    this.updates.activateUpdate().then(() => document.location.reload())
  }

  onAlertClick(error: Message) {
    if (!error.action) return;
    error.action();
  }
}
