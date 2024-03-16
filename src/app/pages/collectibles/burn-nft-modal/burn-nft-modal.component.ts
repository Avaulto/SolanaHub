import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonImg, IonLabel, IonText } from "@ionic/angular/standalone";
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { NftModalItemComponent } from '../nft-modal-item/nft-modal-item.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'burn-nft-modal',
  templateUrl: './burn-nft-modal.component.html',
  styleUrls: ['./burn-nft-modal.component.scss'],
  standalone: true,
  imports:[IonImg,IonLabel, IonText,AlertComponent,NftModalItemComponent, DecimalPipe]
})
export class BurnNftModalComponent  implements OnInit {
  @Input() nfts:NFT[]
  @Output() toBurnNFTs = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.toBurnNFTs.emit({nftsToBurn: this.nfts})
    
  }

}
