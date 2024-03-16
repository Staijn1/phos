import {Component} from "@angular/core";
import {INetworkState, RoomState} from "@angulon/interfaces";
import {Store} from "@ngrx/store";
import {MAXIMUM_BRIGHTNESS, SPEED_MAXIMUM_INTERVAL_MS} from "../../shared/constants";
import {DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {RadialProgressComponent} from "../../shared/components/radialprogress/radial-progress.component";
import {SharedModule} from "../../shared/shared.module";

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
    SharedModule
  ],
  standalone: true
})
export class HomePageComponent {
  private ledstripState: RoomState | undefined;
  networkState: INetworkState | undefined;

  get speedPercentage() {
    return this.ledstripState ? this.ledstripState?.speed / SPEED_MAXIMUM_INTERVAL_MS * 100 : 0;
  }

  get brightnessPercentage() {
    return this.ledstripState ? this.ledstripState?.brightness / MAXIMUM_BRIGHTNESS * 100 : 0;
  }

  constructor(private readonly store: Store<{ ledstripState: RoomState, networkState: INetworkState }>) {
    this.store.select("ledstripState").subscribe((state) => this.ledstripState = state);

    this.store.select("networkState").subscribe((state) => this.networkState = state);
  }
}
