import { Component, Input, OnInit } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonImg, IonButton,IonSkeletonText, IonLabel,IonText,IonChip,IonIcon,    IonCheckbox } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {  ellipsisVertical } from 'ionicons/icons';
@Component({
  selector: 'nft-item',
  templateUrl: './nft-item.component.html',
  styleUrls: ['./nft-item.component.scss'],
  standalone: true,
  imports:[IonImg, IonButton,IonSkeletonText, IonLabel,IonText,IonChip,IonIcon ,    IonCheckbox]
})
export class NftItemComponent  implements OnInit {
  @Input() nft: NFT
  imagesLoaded = false;
  loadImage() {    
    this.imagesLoaded = true;
  }
  constructor() {
    addIcons({ellipsisVertical})
   }

  ngOnInit() {
    
  }
  openActionDropDown(){
    console.log('click dd');
    
  }
}
