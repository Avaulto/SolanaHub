import { Component, Input, OnInit, inject } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonImg, IonButton, IonLabel,IonText} from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'list-nft-modal',
  templateUrl: './list-nft-modal.component.html',
  styleUrls: ['./list-nft-modal.component.scss'],
  standalone: true,
  imports:[IonImg,IonButton, IonLabel,IonText]
})
export class ListNftModalComponent  implements OnInit {
  @Input() nft: NFT;
  private _modalCtrl = inject(ModalController)
  constructor() { }

  ngOnInit() {}
  closeModal(){

  }
}
