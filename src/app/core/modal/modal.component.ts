import { Component, OnInit, EventEmitter } from '@angular/core';

import { ModalService, IModalContent } from './modal.service';

@Component({
  selector: 'cm-modal',
  templateUrl: './modal.component.html',
  styleUrls: [ './modal.component.scss' ]
})
export class ModalComponent implements OnInit {

  modalVisible = false;
  modalContent: IModalContent = {};
  cancel: () => void;
  ok: () => void;
  defaultModalContent: IModalContent = {
    header: 'Please Confirm',
    body: 'Are you sure you want to continue?',
    cancelButtonText: 'Cancel',
    OKButtonText: 'OK',
    cancelButtonVisible: true
  };

  constructor(private modalService: ModalService) {
    modalService.show = this.show.bind(this);
    modalService.hide = this.hide.bind(this);
  }

  ngOnInit() {

  }

  show(modalContent: IModalContent) {
    this.modalContent = Object.assign(this.defaultModalContent, modalContent);
    this.modalVisible = true;

    const promise = new Promise<boolean>((resolve, reject) => {
      this.cancel = () => {
        this.hide();
        resolve(false);
      };
      this.ok = () => {
        this.hide();
        resolve(true);
      };
    });
    return promise;
  }

  hide() {
    this.modalVisible = false
  }

}
