import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
  selector: "app-offcanvas",
  templateUrl: "./off-canvas.component.html",
  styleUrls: ["./off-canvas.component.scss"]
})
export class OffCanvasComponent implements AfterViewInit {
  @Input() width = "400px";
  @ViewChild("offCanvas") offcanvasElement!: ElementRef;
  @ViewChild("offCanvasBackground") offcanvasBackgroundElement!: ElementRef;

  get isOpen(): boolean {
    const currentElementWidth = this.offcanvasElement.nativeElement.style.width;
    return currentElementWidth !== "0px" || currentElementWidth == "";
  }

  ngAfterViewInit(): void {
    this.offcanvasElement.nativeElement.style.visibility = "hidden";
    this.offcanvasElement.nativeElement.style.width = "0px";

    this.offcanvasBackgroundElement.nativeElement.style.display = "none";
  }

  open(): void {
    this.offcanvasElement.nativeElement.style.visibility = "visible";
    this.offcanvasElement.nativeElement.style.width = this.width;

    this.offcanvasBackgroundElement.nativeElement.style.display = "block";
  }

  close(): void {
    this.offcanvasElement.nativeElement.style.width = "0px";
    this.offcanvasBackgroundElement.nativeElement.style.display = "none";
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}
