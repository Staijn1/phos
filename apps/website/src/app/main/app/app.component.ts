import {Component} from '@angular/core'
import {SwUpdate} from '@angular/service-worker'
import {ErrorService} from '../../services/error/error.service'
import {ThemeService} from "../../services/theme/theme.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  updateAvailable = false

  constructor(readonly updates: SwUpdate, public errorService: ErrorService, private theme: ThemeService) {
    this.theme.loadTheme();
    // Service worker update, but only in production. During development, the service worker is disabled which results in an error.
    // Enabling the service worker would result in a lot of caching, which is not desired during development because it would be hard to test changes.
    if (environment.production) {
      updates.checkForUpdate().then((hasNewUpdate) => {
        this.updateAvailable = hasNewUpdate
      })
    }
  }

  update() {
    this.updates.activateUpdate().then(() => document.location.reload())
  }
}
