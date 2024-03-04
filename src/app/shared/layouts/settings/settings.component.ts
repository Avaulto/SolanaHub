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
      value: 'https://mb-avaulto-cc28.mainnet.rpcpool.com'
    },
    {
      name: 'Helius',
      imageURL: '/assets/images/helius-icon.svg',
      value: ''
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
  //   public setPriorityFee(rank: string) {
  //   this._utilsService.priorityFee = PriorityFee[rank];
  //   this.currentPrioretyFee = PriorityFee[rank];

  //   const toasterMessage: toastData = {
  //     message: 'Priority fee updated',
  //     segmentClass: "toastInfo"
  //   }
  //   this._toasterService.msg.next(toasterMessage)
  // }
  constructor() { }

  ngOnInit() { }
  closeModal(){
    this._modalCtrl.dismiss()
  }
}
