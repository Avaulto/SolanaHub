import { Component, Input, OnInit } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonImg, IonLabel, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'nft-modal-item',
  templateUrl: './nft-modal-item.component.html',
  styleUrls: ['./nft-modal-item.component.scss'],
  standalone: true,
  imports:[IonImg,IonLabel, IonText]
})
export class NftModalItemComponent  implements OnInit {
  @Input() nft:NFT = null
  constructor() { }

  ngOnInit() {}

}
