import {Component} from "@angular/core";
import { INetworkState, IRoom, RoomState } from '@angulon/interfaces';
import {Store} from "@ngrx/store";
import {MAXIMUM_BRIGHTNESS, SPEED_MAXIMUM_INTERVAL_MS} from "../../shared/constants";
import {DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {RadialProgressComponent} from "../../shared/components/radialprogress/radial-progress.component";
import {SharedModule} from "../../shared/shared.module";
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: "app-home",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  imports: [
    DecimalPipe,
    RadialProgressComponent,
    NgForOf,
    NgIf,
    NgClass,
    SharedModule,
    FontAwesomeModule
  ],
  standalone: true
})
export class HomePageComponent {
  networkState: INetworkState | undefined;

  convertSpeedToPercentage(speed: number) {
    return speed / SPEED_MAXIMUM_INTERVAL_MS * 100;
  }

  convertBrightnessToPercentage(brightness: number) {
    return brightness / MAXIMUM_BRIGHTNESS * 100;
  }

  constructor(private readonly store: Store<{ ledstripState: RoomState, networkState: INetworkState }>) {
    this.store.select("networkState").subscribe((state) => this.networkState = state);
  }

  protected readonly offlineWarningIcon = faTriangleExclamation;

  getOfflineDevicesCount(room: IRoom) {
    return room.connectedDevices.filter((device) => !device.isConnected).length;
  }
}
