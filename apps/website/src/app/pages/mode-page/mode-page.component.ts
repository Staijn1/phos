import { Component, OnDestroy } from '@angular/core';
import { ModeInformation } from '@angulon/interfaces';
import { ChangeRoomMode } from '../../../redux/roomstate/roomstate.action';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ClientNetworkState } from '../../../redux/networkstate/ClientNetworkState';
import { getStateOfSelectedRooms } from '../../shared/functions';


@Component({
  selector: 'app-mode',
  templateUrl: './mode-page.component.html',
  styleUrls: ['./mode-page.component.scss'],
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class ModePageComponent implements OnDestroy {
  modes: ModeInformation[] = [];
  iconBoxColors = [
    'primary',
    'secondary',
    'accent',
    'warning',
    'error',
    'success',
  ];
  selectedMode = 0;


  constructor(private readonly store: Store<{
    modes: ModeInformation[],
    networkState: ClientNetworkState | undefined
  }>) {
    this.store.select('modes').subscribe(modes => this.modes = modes);

    combineLatest([this.store.select('networkState'), this.store.select('modes')])
      .subscribe(([networkState, modes]) => {
        const selectedState = getStateOfSelectedRooms(networkState);

        this.modes = modes;
        if (!selectedState) return;

        // Find the mode with the same id that is currently active on the ledstrip
        const mode = modes.find(mode => mode.mode === selectedState.mode);
        if (!mode) return;

        this.selectedMode = modes.indexOf(mode);
      });
  }

  ngOnDestroy(): void {
    this.modes = [];
  }

  /**
   * Fired when the user clicks on a mode button
   * @param {MouseEvent} $event
   */
  onModeSelect($event: MouseEvent): void {
    const id = parseInt(($event.currentTarget as HTMLElement).id, 10);
    this.selectedMode = id;

    this.store.dispatch(new ChangeRoomMode(id));
  }
}
