import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.scss']
})
export class OffCanvasComponent implements AfterViewInit {
  @Input() width = '400px';
  @Input() position: 'left' | 'right' = 'right';
  @Output() stateCanged = new EventEmitter<boolean>();
  @ViewChild('offCanvas', { static: false }) offcanvasElement!: ElementRef;
  @ViewChild('offCanvasBackground', { static: false }) offcanvasBackgroundElement!: ElementRef;

  isOpen = false;

  ngAfterViewInit(): void {
    this.offcanvasElement.nativeElement.style.visibility = 'hidden';
    this.offcanvasElement.nativeElement.style.width = '0px';

    this.offcanvasBackgroundElement.nativeElement.style.display = 'none';
  }

  open(): void {
    this.offcanvasElement.nativeElement.style.visibility = 'visible';
    this.offcanvasElement.nativeElement.style.width = this.width;

    this.offcanvasBackgroundElement.nativeElement.style.display = 'block';

    this.isOpen = true;
    this.stateCanged.emit(this.isOpen);
  }

  close(): void {
    this.offcanvasElement.nativeElement.style.width = '0px';
    this.offcanvasBackgroundElement.nativeElement.style.display = 'none';
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
}
