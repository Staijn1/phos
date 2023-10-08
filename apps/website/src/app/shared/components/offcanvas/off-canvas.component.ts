import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.scss']
})
export class OffCanvasComponent {
  @Input() width = '400px';
  @Input() position: 'left' | 'right' = 'right';
  @Output() stateChanged = new EventEmitter<boolean>();
  protected id = this.generateElementId();
  private _isOpen = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;
    this.stateChanged.emit(this._isOpen);
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  toggle(): void {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
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
