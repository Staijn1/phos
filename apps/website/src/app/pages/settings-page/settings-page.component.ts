import {Component, OnInit, ViewChild} from '@angular/core';
import {faGripLines, faTrash} from '@fortawesome/free-solid-svg-icons';
import {GeneralSettings, UserPreferences} from '../../shared/types/types';
import {themes} from '../../shared/constants';
import {Store} from '@ngrx/store';
import {ChangeGeneralSettings} from '../../../redux/user-preferences/user-preferences.action';
import {FormsModule, NgForm} from '@angular/forms';
import {debounceTime, skip} from 'rxjs';
import {ThemeVisualizationComponent} from '../../shared/components/theme-visualization/theme-visualization.component';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {INetworkState} from '@angulon/interfaces';
import {WebsocketService} from '../../services/websocketconnection/websocket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ObjectId} from 'typeorm';
import {SharedModule} from "../../shared/shared.module";

@Component({
  selector: "app-settings",
  templateUrl: "./settings-page.component.html",
  styleUrls: ["./settings-page.component.scss"],
  imports: [
    ThemeVisualizationComponent,
    NgForOf,
    FontAwesomeModule,
    FormsModule,
    NgIf,
    SharedModule,
    JsonPipe
  ],
  standalone: true
})
export class SettingsPageComponent implements OnInit{
  @ViewChild("form", { static: true }) form!: NgForm;
  settings: GeneralSettings | undefined;
  selectedTheme = 0;
  private skipFormUpdate = false;
  availableThemes = themes;
  activeMenu = 0;
  draggableIcon = faGripLines;
  networkState: INetworkState | undefined;
  trashIcon = faTrash;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly websocketConnectionService: WebsocketService,
    private readonly store: Store<{
      userPreferences: UserPreferences,
      networkState: INetworkState,
    }>) {
    this.store.select("userPreferences").subscribe(preferences => {
      if (this.skipFormUpdate) return;

      this.settings = structuredClone(preferences.settings);
      this.selectedTheme = this.availableThemes.findIndex(theme => theme === preferences.settings.theme);
    });

    this.store.select("networkState").subscribe(networkState => {
      this.networkState = networkState;
    });
  }

  ngOnInit(): void {
    // Skip the first value change because it's the initial value of the form
    this.form.form.valueChanges
      .pipe(debounceTime(50), skip(1))
      .subscribe(newValues => {
        this.skipFormUpdate = true;
        this.store.dispatch(new ChangeGeneralSettings(newValues));
      });

    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.activeMenu = parseInt(fragment);
      }
    });
  }

  setTheme(theme: string): void {
    this.store.dispatch(new ChangeGeneralSettings({ theme: theme }));
  }

  /**
   * Changes the selected menu item which causes the content to change too.
   * Also changes the URL to go to the sub-page /settings/:id so the user can refresh the page and still be on the menu item
   * @param number
   */
  selectMenu(number: number) {
    this.activeMenu = number;
    this.router.navigate([], {relativeTo: this.activatedRoute, fragment: this.activeMenu.toString()});
  }

  createRoom(roomName: string) {
    this.websocketConnectionService.createRoom(roomName).then();
  }

  deleteRoom(name: string) {
    this.websocketConnectionService.removeRoom(name).then();
  }

  renameDevice() {
    if (!this.settings?.deviceName) return;
    this.websocketConnectionService.renameDevice(this.settings.deviceName);
  }
}
