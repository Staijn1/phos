import { Component, OnDestroy } from '@angular/core';
import { RoomState, ModeInformation } from '@angulon/interfaces';
import { ChangeRoomMode } from '../../../redux/roomstate/roomstate.action';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { NgClass, NgForOf, NgIf } from '@angular/common';


@Component({
  selector: "app-mode",
  templateUrl: "./mode-page.component.html",
  styleUrls: ["./mode-page.component.scss"],
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


  constructor(private readonly store: Store<{ modes: ModeInformation[], roomState: RoomState | undefined }>) {
    this.store.select('modes').subscribe(modes => this.modes = modes);

    combineLatest([this.store.select('roomState'), this.store.select('modes')]).subscribe(([roomState, modes]) => {
      this.modes = modes;
      if (!roomState) return;

      // Find the mode with the same id that is currently active on the ledstrip
      const mode = modes.find(mode => mode.mode === roomState.mode);
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
