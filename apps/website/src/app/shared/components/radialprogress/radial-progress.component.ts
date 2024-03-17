import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { gsap } from "gsap";

@Component({
  selector: "app-radial-progress",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./radial-progress.component.html",
  styleUrls: ["./radial-progress.component.scss"]
})
export class RadialProgressComponent implements AfterViewInit {
  @ViewChild("radialContainer") radialContainer!: ElementRef;
  @Input() size = "8em";
  @Input() thickness = "5px";
  @Input() label = "Label";


  private _oldPercentage = 0;
  private _percentage = 0;

  @Input() set percentage(value: number) {
    this._oldPercentage = this._percentage;
    this._percentage = value;

    if (this._oldPercentage === this._percentage) return;
    this.animatePercentageChange();
  }

  get percentage(): number {
    return this._percentage;
  }


  ngAfterViewInit(): void {
    this.animatePercentageChange();
  }


  private animatePercentageChange() {
    if (!this.radialContainer) return;
    gsap
      .fromTo(this.radialContainer.nativeElement, {
        '--value': this._oldPercentage
      }, {
        '--value': this._percentage,
        ease: 'power2.inOut',
        duration: 0.5
      });
  }
}
