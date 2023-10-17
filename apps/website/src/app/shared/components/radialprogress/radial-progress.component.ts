import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { gsap } from "gsap";

@Component({
  selector: "app-radial-progress",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./radial-progress.component.html",
  styleUrls: ["./radial-progress.component.scss"]
})
export class RadialProgressComponent implements OnInit {
  @ViewChild("radialContainer") radialContainer!: ElementRef;
  @ViewChild("numberContainer") numberContainer!: ElementRef;
  @Input() size = "8em";
  @Input() thickness = "5px";
  @Input() label = "Label";

  private _percentage = 0;
  @Input() set percentage(value: number) {
    this._percentage = value;
    this.animatePercentageChange();
  }

  get percentage(): number {
    return this._percentage;
  }


  ngOnInit(): void {
    this.animatePercentageChange();
  }


  private animatePercentageChange() {
    if (!this.radialContainer) return;
    gsap
      .to(this.radialContainer.nativeElement, {
        "--value": this._percentage,
        ease: "power2.inOut"
      })
      .duration(0.5);
  }
}
