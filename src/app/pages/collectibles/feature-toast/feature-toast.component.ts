import { Component, Input, OnInit, inject } from '@angular/core';
import { IonButton, IonImg } from "@ionic/angular/standalone";
import { NFT } from 'src/app/models';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
@Component({
  selector: 'feature-toast',
  templateUrl: './feature-toast.component.html',
  styleUrls: ['./feature-toast.component.scss'],
  standalone: true,
  imports:[IonButton, IonImg]
})
export class FeatureToastComponent  implements OnInit {
  @Input() nfts:NFT[]
  
  private _modalCtrl = inject(ModalController)

  ngOnInit() {}
  async openModal(componentName: 'list-nft-modal' | 'send-nft-modal' | 'burn-nft-modal') {
    let config = {
      imgUrl: null,
      title: null,
      desc: null,
      btnText: null
    }
    switch (componentName) {
      case 'list-nft-modal':
        config.imgUrl = 'assets/images/list-icon.svg'
        config.title = 'List'
        config.desc = 'List your NFT directly in your favorite market place'
        config.btnText = 'List now'
        break;
      case 'send-nft-modal':
        config.imgUrl = 'assets/images/send-icon.svg'
        config.title = `Send`
        config.desc = `Send your NFT${this.nfts.length > 1 ? 's' : ''} to a different wallet`
        config.btnText = `Send ${this.nfts.length} NFT${this.nfts.length > 1 ? 's' : ''}`
        break;
      case 'burn-nft-modal':
        config.imgUrl = 'assets/images/trash-icon.svg'
        config.title = 'Burn'
        config.desc = `Burn your NFT${this.nfts.length > 1 ? 's' : ''} and get SOL back`
        config.btnText = `Burn ${this.nfts.length} NFT${this.nfts.length > 1 ? 's' : ''}`
        break;
    }
    
    const modal = await this._modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        componentName,
        data: {nfts: this.nfts},
        config
      },
      cssClass: 'modal-style'
    });
    modal.present();
    // const { data, role } = await modal.onWillDismiss();

  }
}
