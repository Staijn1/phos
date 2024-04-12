import {Component, ViewChild} from '@angular/core';
import {IRoom, RoomState} from '@angulon/interfaces';
import {Store} from '@ngrx/store';
import {MAXIMUM_BRIGHTNESS, SPEED_MAXIMUM_INTERVAL_MS} from '../../shared/constants';
import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {RadialProgressComponent} from '../../shared/components/radialprogress/radial-progress.component';
import {SharedModule} from '../../shared/shared.module';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PowerDrawComponent} from '../../shared/components/power-draw/power-draw.component';
import {ClientNetworkState, WebsocketConnectionStatus} from '../../../redux/networkstate/ClientNetworkState';
import {distinctUntilChanged, map} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [
    DecimalPipe,
    RadialProgressComponent,
    NgForOf,
    NgIf,
    NgClass,
    SharedModule,
    FontAwesomeModule,
    PowerDrawComponent
  ],
  standalone: true
})
export class HomePageComponent {
  @ViewChild(PowerDrawComponent) powerDrawComponent: PowerDrawComponent | undefined;
  networkState: ClientNetworkState | undefined;
  private isChartInitialized = false;

  convertSpeedToPercentage(speed: number) {
    return speed / SPEED_MAXIMUM_INTERVAL_MS * 100;
  }

  convertBrightnessToPercentage(brightness: number) {
    return brightness / MAXIMUM_BRIGHTNESS * 100;
  }

  constructor(private readonly store: Store<{ roomState: RoomState, networkState: ClientNetworkState }>) {
    this.store.select('networkState').subscribe((state) => {
      this.networkState = state;
    });

    this.store.select('networkState').pipe(
      map(s => s.connectionStatus),
      distinctUntilChanged()
    ).subscribe((connectionStatus) => {
      if (connectionStatus === WebsocketConnectionStatus.CONNECTED && this.isChartInitialized) {
        this.powerDrawComponent?.startPollingData();
      } else if (connectionStatus === WebsocketConnectionStatus.DISCONNECTED) {
        this.powerDrawComponent?.stopPollingData();
      }
    });
  }

  protected readonly offlineWarningIcon = faTriangleExclamation;

  getOfflineDevicesCount(room: IRoom) {
    return room.connectedDevices.filter((device) => !device.isConnected).length;
  }

  onChartInit() {
    this.isChartInitialized = true;
    if (this.networkState?.connectionStatus === WebsocketConnectionStatus.CONNECTED) {
      this.powerDrawComponent?.startPollingData();
    }
  }
}
