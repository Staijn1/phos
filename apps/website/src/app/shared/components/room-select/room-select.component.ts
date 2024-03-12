import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {INetworkState, IRoom} from '@angulon/interfaces';
import {Store} from '@ngrx/store';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import {SelectRoom, UnselectRoom} from '../../../../redux/networkstate/networkstate.action';
import {ClientNetworkState} from '../../../../redux/networkstate/ClientNetworkState';

@Component({
  selector: 'app-room-select',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './room-select.component.html',
  styleUrls: ['./room-select.component.scss'],
})
export class RoomSelectComponent {
  networkState: ClientNetworkState | undefined;
  offlineWarningIcon = faTriangleExclamation;

  constructor(private readonly store: Store<{ networkState: ClientNetworkState }>) {
    this.store.select('networkState').subscribe((networkState) => {
      this.networkState = networkState;
    });
  }

  getOfflineDevicesCount(room: IRoom) {
    return room.connectedDevices.filter((device) => !device.isConnected).length;
  }

  isRoomSelected(room: IRoom) {
    return this.networkState?.selectedRooms.some((selectedRoom) => selectedRoom.id === room.id);
  }

  /**
   * Fired from the HTML when the selection state changes (selected or unselected)
   * @param room
   */
  onRoomSelectionChanged(event: Event, room: IRoom) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.store.dispatch(new SelectRoom(room));
    } else {
      this.store.dispatch(new UnselectRoom(room));
    }
  }
}
