import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-v2-popup',
  templateUrl: './v2-popup.component.html',
  styleUrls: ['./v2-popup.component.scss'],
})
export class V2PopupComponent implements OnInit {

  constructor(private _modal: ModalController) { }

  ngOnInit() { }

  closePopup() {
    this._modal.dismiss()
  }
}
