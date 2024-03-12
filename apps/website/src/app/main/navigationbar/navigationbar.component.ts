import { Component, Input, ViewChild } from "@angular/core";
import {
  faChartBar,
  faCog,
  faEyeDropper,
  faHome,
  faList,
  faMinus, faObjectGroup,
  faPlus,
  faPowerOff,
  faRunning,
  faSlidersH,
  faWalking
} from '@fortawesome/free-solid-svg-icons';
import { Store } from "@ngrx/store";
import { ColorpickerComponent } from "../../shared/components/colorpicker/colorpicker.component";
import { LedstripState } from "@angulon/interfaces";
import { WebsocketService } from "../../services/websocketconnection/websocket.service";
import {
  DecreaseLedstripBrightness,
  DecreaseLedstripSpeed,
  IncreaseLedstripBrightness,
  IncreaseLedstripSpeed
} from "../../../redux/ledstrip/ledstrip.action";
import {
  MAXIMUM_BRIGHTNESS,
  MINIMUM_BRIGHTNESS,
  SPEED_MAXIMUM_INTERVAL_MS,
  SPEED_MINIMUM_INTERVAL_MS
} from "../../shared/constants";

@Component({
  selector: "app-navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.scss"]
})
export class NavigationbarComponent {
  @ViewChild(ColorpickerComponent) colorpicker!: ColorpickerComponent;
  @Input() colorPickerOrientation: "horizontal" | "vertical" = "horizontal";

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

  minimumBrightnessReached = false;
  minimumSpeedReached = false;
  maximumBrightnessReached = false;
  maximumSpeedReached = false;


  constructor(
    public connection: WebsocketService,
    private store: Store<{ ledstripState: LedstripState }>
  ) {
    store.select("ledstripState").subscribe(state => {
      this.minimumBrightnessReached = state.brightness === MINIMUM_BRIGHTNESS;
      this.minimumSpeedReached = state.speed === SPEED_MINIMUM_INTERVAL_MS;
      this.maximumBrightnessReached = state.brightness === MAXIMUM_BRIGHTNESS;
      this.maximumSpeedReached = state.speed === SPEED_MAXIMUM_INTERVAL_MS;
    });
  }

  turnOff(): void {
    this.connection.turnOff();
  }

  decreaseBrightness() {
    this.store.dispatch(new DecreaseLedstripBrightness());
  }

  increaseBrightness() {
    this.store.dispatch(new IncreaseLedstripBrightness());
  }

  increaseSpeed() {
    this.store.dispatch(new IncreaseLedstripSpeed());
  }

  decreaseSpeed() {
    this.store.dispatch(new DecreaseLedstripSpeed());
  }
}
