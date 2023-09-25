import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
  selector: "app-offcanvas",
  templateUrl: "./off-canvas.component.html",
  styleUrls: ["./off-canvas.component.scss"]
})
export class OffCanvasComponent implements AfterViewInit {
  @Input() width = "400px";
  @ViewChild("offCanvas") offcanvasElement!: ElementRef;

  ngAfterViewInit(): void {
    this.offcanvasElement.nativeElement.style.visibility = "hidden";
    this.offcanvasElement.nativeElement.style.width = "0px";
  }

  open(): void {
    const elementStyle = this.offcanvasElement.nativeElement.style;
    elementStyle.visibility = "visible";
    elementStyle.width = this.width;
  }

  close(): void {
    this.offcanvasElement.nativeElement.style.width = "0px";
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  get isOpen(): boolean {
    const currentElementWidth = this.offcanvasElement.nativeElement.style.width;
    return currentElementWidth !== "0px" || currentElementWidth == "";
  }


}
