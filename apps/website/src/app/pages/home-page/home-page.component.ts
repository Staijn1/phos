import { Component, HostListener, ViewChild } from '@angular/core';
import { IDevice, IRoom, RoomState } from '@angulon/interfaces';
import {Store} from '@ngrx/store';
import {MAXIMUM_BRIGHTNESS, SPEED_MAXIMUM_INTERVAL_MS} from '../../shared/constants';
import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {RadialProgressComponent} from '../../shared/components/radialprogress/radial-progress.component';
import {SharedModule} from '../../shared/shared.module';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PowerDrawComponent} from '../../shared/components/power-draw/power-draw.component';
import {ClientNetworkState, WebsocketConnectionStatus} from '../../../redux/networkstate/ClientNetworkState';
import {distinctUntilChanged, map} from 'rxjs';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { WebsocketService } from '../../services/websocketconnection/websocket.service';

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
  protected readonly faTrash = faTrashAlt;
  protected readonly offlineWarningIcon = faTriangleExclamation;
  protected showContextMenu = false;
  protected contextMenuX = 0;
  protected contextMenuY = 0;
  private isChartInitialized = false;
  networkState: ClientNetworkState | undefined;
  private contextMenuDevice: IDevice | undefined;



  constructor(
    private readonly store: Store<{ roomState: RoomState, networkState: ClientNetworkState }>,
    private readonly connection: WebsocketService) {
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


  convertSpeedToPercentage(speed: number) {
    return speed / SPEED_MAXIMUM_INTERVAL_MS * 100;
  }

  convertBrightnessToPercentage(brightness: number) {
    return brightness / MAXIMUM_BRIGHTNESS * 100;
  }

  getOfflineDevicesCount(room: IRoom) {
    return room.connectedDevices.filter((device) => !device.isConnected).length;
  }

  onChartInit() {
    this.isChartInitialized = true;
    if (this.networkState?.connectionStatus === WebsocketConnectionStatus.CONNECTED) {
      this.powerDrawComponent?.startPollingData();
    }
  }

  onContextMenuClick(event: MouseEvent, device: IDevice) {
    event.preventDefault();

    this.contextMenuDevice = device;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.showContextMenu = true;
  }

  @HostListener('document:click')
  onClick() {
    this.showContextMenu = false;
    this.contextMenuDevice = undefined;
  }

  deleteDevice() {
    if(!this.contextMenuDevice) return;

    this.connection.deleteDevice(this.contextMenuDevice);
  }
}
