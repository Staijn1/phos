import {Component} from '@angular/core'
import {SwUpdate} from '@angular/service-worker'
import {ErrorService} from './services/error/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  updateAvailable = false

  constructor(readonly updates: SwUpdate, public errorService: ErrorService) {
    updates.available.subscribe(event => this.updateAvailable = true)
  }
}
