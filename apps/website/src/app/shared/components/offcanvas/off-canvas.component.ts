import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgbModalOptions, NgbOffcanvas, NgbOffcanvasOptions, NgbOffcanvasRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.scss'],
})
export class OffCanvasComponent {
  @ViewChild('content') content!: ElementRef;
  private offcanvas: NgbOffcanvasRef | undefined;


  /**
   * Inject the offcanvas service so we can open and close it using ng-bootstrap
   * @param offcanvasService
   */
  constructor(private offcanvasService: NgbOffcanvas) {
  }

  /**
   * Open the offcanvas
   * @param {NgbOffcanvasOptions} options
   */
  open(options?: NgbOffcanvasOptions): void {
    this.offcanvas = this.offcanvasService.open(this.content, {ariaLabelledBy: 'offcanvas-basic-title', ...options});
  }

  /**
   * Close the offcanvas
   */
  close(): void {
    if (this.offcanvas) {
      this.offcanvas.close();
      this.offcanvasService.dismiss();
    }
  }
}
