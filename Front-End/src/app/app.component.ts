import { Component } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  updateAvailable = false
  constructor(readonly updates: SwUpdate) {
    updates.available.subscribe(event => {
      this.updateAvailable = true
    })

    // updates.activateUpdate().then(() => document.location.reload())
  }
}
