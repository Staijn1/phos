import {Component, Input, ViewChild} from '@angular/core';
import {
  faChartBar,
  faCog,
  faEyeDropper,
  faHome,
  faList,
  faMinus,
  faObjectGroup,
  faPlus,
  faPowerOff,
  faRunning,
  faSlidersH,
  faWalking
} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngrx/store';
import {ColorpickerComponent} from '../../shared/components/colorpicker/colorpicker.component';
import {RoomState} from '@angulon/interfaces';
import {WebsocketService} from '../../services/websocketconnection/websocket.service';
import {
  DecreaseRoomBrightness,
  DecreaseRoomSpeed,
  IncreaseRoomBrightness,
  IncreaseRoomSpeed
} from '../../../redux/roomstate/roomstate.action';
import {
  MAXIMUM_BRIGHTNESS,
  MINIMUM_BRIGHTNESS,
  SPEED_MAXIMUM_INTERVAL_MS,
  SPEED_MINIMUM_INTERVAL_MS
} from '../../shared/constants';
import {ClientNetworkState, WebsocketConnectionStatus} from '../../../redux/networkstate/ClientNetworkState';
import {distinctUntilChanged, map} from 'rxjs';
import {getStateOfSelectedRooms} from '../../shared/functions';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent {
  @ViewChild(ColorpickerComponent) colorpicker!: ColorpickerComponent;
  @Input() colorPickerOrientation: 'horizontal' | 'vertical' = 'horizontal';

  readonly homeIcon = faHome;
  readonly modeIcon = faList;
  readonly visualizerIcon = faChartBar;
  readonly colorpickerIcon = faEyeDropper;
  readonly powerOffIcon = faPowerOff;
  readonly controlsIcon = faSlidersH;
  readonly settingsIcon = faCog;
  readonly decreaseBrightnessIcon = faMinus;
  readonly increaseBrightnessIcon = faPlus;
  readonly speedIncreaseIcon = faRunning;
  readonly speedDecreaseIcon = faWalking;
  readonly roomsSelectIcon = faObjectGroup;

  disableDecreaseBrightnessAction = false;
  disableDecreaseSpeedAction = false;
  disableIncreaseBrightnessAction = false;
  disableIncreaseSpeedAction = false;

  websocketConnectionStatus: WebsocketConnectionStatus | undefined;
  clearConnectionStatusTimeout: NodeJS.Timeout | undefined;

  get isDisconnected(): boolean {
    return this.websocketConnectionStatus === WebsocketConnectionStatus.DISCONNECTED;
  };

  get isConnecting(): boolean {
    return this.websocketConnectionStatus === WebsocketConnectionStatus.CONNECTING;
  }

  get isConnected(): boolean {
    return this.websocketConnectionStatus === WebsocketConnectionStatus.CONNECTED;
  }

  get isConnectionError(): boolean {
    return this.websocketConnectionStatus === WebsocketConnectionStatus.CONNECTERROR;
  }


  constructor(
    public connection: WebsocketService,
    private store: Store<{
      roomState: RoomState,
      networkState: ClientNetworkState
    }>
  ) {
    store.select('networkState' ).subscribe(state => {
      const selectedRoomState = getStateOfSelectedRooms(state);

      // When no room is selected, disable all action buttons
      if (!selectedRoomState){
        this.disableDecreaseBrightnessAction = true;
        this.disableDecreaseSpeedAction = true;
        this.disableIncreaseBrightnessAction = true;
        this.disableIncreaseSpeedAction = true;
        return;
      }

      // Disable the action buttons when their minimum or maximum values are reached to indicate to the user that they can't go any further
      this.disableDecreaseBrightnessAction = selectedRoomState.brightness === MINIMUM_BRIGHTNESS;
      this.disableDecreaseSpeedAction = selectedRoomState.speed === SPEED_MAXIMUM_INTERVAL_MS;
      this.disableIncreaseBrightnessAction = selectedRoomState.brightness === MAXIMUM_BRIGHTNESS;
      this.disableIncreaseSpeedAction = selectedRoomState.speed === SPEED_MINIMUM_INTERVAL_MS;
    });

    // Subscribe to change in the networkstate.connectionstatus only when that property changes
    store.select('networkState')
      .pipe(
        distinctUntilChanged((prev, curr) => prev.connectionStatus === curr.connectionStatus),
        map(state => state.connectionStatus)
      )
      .subscribe(connectionStatus => {
        this.websocketConnectionStatus = connectionStatus;

        // After 5 seconds, clear the connection status so all visuals are removed
        if (this.clearConnectionStatusTimeout) {
          clearTimeout(this.clearConnectionStatusTimeout);
        }

        if (this.websocketConnectionStatus === WebsocketConnectionStatus.CONNECTED) {
          this.clearConnectionStatusTimeout = setTimeout(() => this.websocketConnectionStatus = undefined, 5000);
        }
      });
  }

  turnOff(): void {
    this.connection.turnOff();
  }

  decreaseBrightness() {
    this.store.dispatch(new DecreaseRoomBrightness());
  }

  increaseBrightness() {
    this.store.dispatch(new IncreaseRoomBrightness());
  }

  increaseSpeed() {
    this.store.dispatch(new IncreaseRoomSpeed());
  }

  decreaseSpeed() {
    this.store.dispatch(new DecreaseRoomSpeed());
  }
}
