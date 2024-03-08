import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonImg, IonLabel, IonText } from "@ionic/angular/standalone";
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { NftModalItemComponent } from '../nft-modal-item/nft-modal-item.component';
import { AddressInputComponent } from 'src/app/shared/components/address-input/address-input.component';

@Component({
  selector: 'send-nft-modal',
  templateUrl: './send-nft-modal.component.html',
  styleUrls: ['./send-nft-modal.component.scss'],
  standalone: true,
  imports:[IonImg,IonLabel, IonText,AlertComponent, NftModalItemComponent, AddressInputComponent]
})
export class SendNftModalComponent  implements OnInit {
  @Input() nfts:NFT[]

  @Output() toSendNFTs = new EventEmitter();
  constructor() { }

  ngOnInit() {

    console.log(this.nfts);
    
  }
  onValidAddress(address: string){
    if(address){
      this.toSendNFTs.emit({nftsToTransfer: this.nfts, targetAddress:address})
    }
  }
}
