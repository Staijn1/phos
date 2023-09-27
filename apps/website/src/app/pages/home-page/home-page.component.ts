import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { gsap } from "gsap";

@Component({
  selector: "app-home",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements AfterViewInit {
  @ViewChild("neonTextElement") neonTextElement!: ElementRef<HTMLElement>;
  timeline!: gsap.core.Timeline;

  ngAfterViewInit(): void {
    this.timeline = gsap.timeline();

    this.timeline.to("#Light_Bulb .bulb", { strokeDashoffset: 0, duration: 4, delay: 2 });
    this.timeline.to("#Light_Bulb .reflection", { duration: 0.3, strokeWidth: 7 }, "-=2");
    this.timeline.to("#Light_Bulb .light", { duration: 1, strokeOpacity: 1, fillOpacity: 1 }, "-=1.6");
    this.timeline.to("#introcover", { duration: 1, opacity: 0 }, "-=1.6");
    this.timeline.to("#Light_Bulb", { duration: 0.7, y: -400, ease: "power.out" }, "-=1.6");
    this.timeline.to("#introtext", { strokeDashoffset: 0, duration: 4 }, "-=0.5");
  }
}
