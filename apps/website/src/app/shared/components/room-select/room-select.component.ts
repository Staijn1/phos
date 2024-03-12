import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {INetworkState, IRoom} from '@angulon/interfaces';
import {Store} from '@ngrx/store';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room-select',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './room-select.component.html',
  styleUrls: ['./room-select.component.scss'],
})
export class RoomSelectComponent {
  rooms: IRoom[] = [];
  offlineWarningIcon = faTriangleExclamation;

  constructor(private readonly store: Store<{ networkState: INetworkState }>) {
    this.store.select('networkState').subscribe((networkState) => {
      this.rooms = networkState.rooms;
    });
  }

  getOfflineDevicesCount(room: IRoom) {
    return room.connectedDevices.filter((device) => !device.isConnected).length;
  }

  isRoomSelected(room: IRoom) {
    return true;
  }
}
