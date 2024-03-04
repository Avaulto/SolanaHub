import { Component, Input, OnInit, inject } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonImg, IonButton,IonSkeletonText, IonLabel,IonText,IonChip,IonIcon,    IonCheckbox } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ModalController } from '@ionic/angular';
import {  ellipsisHorizontal } from 'ionicons/icons';
import { NftPreviewComponent } from '../nft-preview/nft-preview.component';
@Component({
  selector: 'nft-item',
  templateUrl: './nft-item.component.html',
  styleUrls: ['./nft-item.component.scss'],
  standalone: true,
  imports:[IonImg, IonButton,IonSkeletonText, IonLabel,IonText,IonChip,IonIcon ,    IonCheckbox]
})
export class NftItemComponent  implements OnInit {
  @Input() nft: NFT
  private _modalCtrl = inject(ModalController)
  imagesLoaded = false;
  
  loadImage() {    
    this.imagesLoaded = true;
  }
  constructor() {
    addIcons({ellipsisHorizontal})
   }

  ngOnInit() {
    
  }
  async openNftPreview(){

      const modal = await this._modalCtrl.create({
        component: NftPreviewComponent,
        componentProps: { nft: this.nft },
        mode: 'ios',
        cssClass: 'nft-modal',
      });
      modal.present();
    
  }
}
