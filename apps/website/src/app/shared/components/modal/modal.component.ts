import { Component, ElementRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class ModalComponent {
  @ViewChild("content") content!: ElementRef;
  closeModalIcon = faTimes;
  private modal: NgbModalRef | undefined;


  /**
   * Inject the modal service so we can open and close the modal using ng-bootstrap
   * @param {NgbModal} modalService
   */
  constructor(private modalService: NgbModal) {
  }

  /**
   * Open the modal
   * @param {NgbModalOptions} options
   */
  open(options?: NgbModalOptions): void {
    this.modal = this.modalService.open(this.content, { ariaLabelledBy: "modal-basic-title", ...options });
  }

  /**
   * Close the modal
   */
  close(): void {

    if (this.modal) {
      this.modal.close();
    }
  }
}
