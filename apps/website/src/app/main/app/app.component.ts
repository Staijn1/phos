import {Component} from '@angular/core'
import {SwUpdate} from '@angular/service-worker'
import {ErrorService} from '../../services/error/error.service'
import {ThemeService} from "../../services/theme/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  updateAvailable = false

  constructor(readonly updates: SwUpdate, public errorService: ErrorService, private theme: ThemeService) {
    this.theme.loadTheme();
    updates.checkForUpdate().then((hasNewUpdate) => {
      this.updateAvailable = hasNewUpdate
    })
  }

  update() {
    this.updates.activateUpdate().then(() => document.location.reload())
  }
}
