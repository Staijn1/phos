import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";

@Component({
  selector: "app-offcanvas",
  templateUrl: "./off-canvas.component.html",
  styleUrls: ["./off-canvas.component.scss"]
})
export class OffCanvasComponent implements AfterViewInit {
  @Input() width = "400px";
  @Input() position: "left" | "right" = "right";
  @Output() stateCanged = new EventEmitter<boolean>();
  @ViewChild("offCanvas", { static: false }) offcanvasElement!: ElementRef;
  @ViewChild("offCanvasBackground", { static: false }) offcanvasBackgroundElement!: ElementRef;
  protected id = this.generateElementId();
  isOpen = false;

  ngAfterViewInit(): void {
    this.offcanvasElement.nativeElement.style.visibility = "hidden";
    this.offcanvasElement.nativeElement.style.width = "0px";

    switch (this.position) {
      case "left":
        this.offcanvasElement.nativeElement.style.left = "0px";
        break;
      case "right":
        this.offcanvasElement.nativeElement.style.right = "0px";
        break;
    }
    this.offcanvasBackgroundElement.nativeElement.style.display = "none";
  }

  open(): void {
    // this.offcanvasElement.nativeElement.style.visibility = "visible";
    // this.offcanvasElement.nativeElement.style.width = this.width;
    //
    // this.offcanvasBackgroundElement.nativeElement.style.display = "block";

    this.isOpen = true;
    this.stateCanged.emit(this.isOpen);
  }

  close(): void {
    // this.offcanvasElement.nativeElement.style.width = "0px";
    // this.offcanvasBackgroundElement.nativeElement.style.display = "none";
    this.isOpen = false;
    this.stateCanged.emit(this.isOpen);
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  onTransitionEnd(event: TransitionEvent) {
    if (!this.isOpen) this.offcanvasElement.nativeElement.style.visibility = "hidden";
  }

  /**
   * To prevent multiple off-canvas components clashing with each other, we generate a random id.
   * It therefore should be a valid html ID
   * @private
   */
  private generateElementId(): string {
    const array = new Uint32Array(5);
    self.crypto.getRandomValues(array);
    return 'offcanvas-' + array.join('-');
  }
}
