import { Component } from "@angular/core";
import { LedstripState } from "@angulon/interfaces";
import { Store } from "@ngrx/store";
import { MAXIMUM_BRIGHTNESS, SPEED_MAXIMUM_INTERVAL_MS } from "../../shared/constants";
import { DecimalPipe } from "@angular/common";
import { RadialProgressComponent } from "../../shared/components/radialprogress/radial-progress.component";

@Component({
  selector: "app-home",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  imports: [
    DecimalPipe,
    RadialProgressComponent
  ],
  standalone: true
})
export class HomePageComponent {
  private ledstripState: LedstripState | undefined;

  get speedPercentage() {
    return this.ledstripState ? this.ledstripState?.speed / SPEED_MAXIMUM_INTERVAL_MS * 100 : 0;
  }

  get brightnessPercentage() {
    return this.ledstripState ? this.ledstripState?.brightness / MAXIMUM_BRIGHTNESS * 100 : 0;
  }
  constructor(private readonly store: Store<{ ledstripState: LedstripState }>) {
    this.store.select("ledstripState").subscribe((state) => {
      this.ledstripState = state;
    });
  }
}
