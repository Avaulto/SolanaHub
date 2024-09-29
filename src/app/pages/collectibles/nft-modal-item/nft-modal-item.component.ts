import { Component, Input, OnInit } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonImg, IonLabel, IonText } from "@ionic/angular/standalone";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'nft-modal-item',
  templateUrl: './nft-modal-item.component.html',
  styleUrls: ['./nft-modal-item.component.scss'],
  standalone: true,
  imports:[DecimalPipe,IonImg,IonLabel, IonText]
})
export class NftModalItemComponent  implements OnInit {
  @Input() nft:NFT = null
  constructor() { }

  ngOnInit() {}

}
