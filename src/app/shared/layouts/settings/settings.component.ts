import { Component, OnInit, inject } from '@angular/core';
import {
  IonLabel,
  IonSegmentButton,
  IonAvatar,
  IonSegment,
  IonImg,
  IonText
} from '@ionic/angular/standalone';
import { Config, PriorityFee } from '../../../models/settings.model';
import { SelectGroupConfigComponent } from './select-group-config/select-group-config.component';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonImg,
    IonLabel,
    IonAvatar,
    IonSegmentButton,
    IonSegment,
    SelectGroupConfigComponent
  ]
})
export class SettingsComponent implements OnInit {
  private _modalCtrl = inject(ModalController)
  public RPCs: Config[] = [
    {
      name: 'Triton',
      imageURL: '/assets/images/triton-icon.svg',
      value: environment.solanaCluster
    },
    {
      name: 'QuickNode',
      imageURL: '/assets/images/quicknode-icon.png',
      value: 'https://evocative-aged-wish.solana-mainnet.discover.quiknode.pro/a9aa5c76f9878b168043cc3452d267e0bda9dfdb'
    },
    {
      name: 'Custom RPC',
      imageURL: '/assets/images/cog-icon.svg',
      value: ''
    }
  ]
  public explorers: Config[] = [
    {
      name: 'Solscan',
      imageURL: '/assets/images/solscan-icon.svg',
      value: 'https://solscan.io'
    },
    {
      name: 'Solana FM',
      imageURL: '/assets/images/solanafm-icon.svg',
      value: 'https://solana.fm'
    },

    {
      name: 'SOL explorer',
      imageURL: '/assets/images/base-explorer-icon.svg',
      value: 'https://explorer.solana.com'
    }
  ]
  public PriorityFee: Config[] = [
    {
      name: 'none',
      imageURL: '/assets/images/battery-1-icon.svg',
      value: PriorityFee.None
    },
    {
      name: 'fast',
      imageURL: '/assets/images/battery-2-icon.svg',
      value: PriorityFee.Fast
    },
    {
      name: 'supercharger',
      imageURL: '/assets/images/battery-3-icon.svg',
      value: PriorityFee.Supercharger
    }
  ];
  constructor() { }

  ngOnInit() { }
  closeModal(){
    this._modalCtrl.dismiss()
  }
}
