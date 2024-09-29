import { Component, Input, OnInit, inject } from '@angular/core';
import { NFT } from 'src/app/models';
import { IonGrid,IonRow,IonCol, IonImg, IonButton, IonLabel,IonText, IonChip, IonIcon } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { copyOutline }  from 'ionicons/icons';
import { CopyTextDirective } from 'src/app/shared/directives/copy-text.directive';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { UtilService } from 'src/app/services';

@Component({
  selector: 'nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrls: ['./nft-preview.component.scss'],
  standalone: true,
  imports:[  IonGrid,IonRow,IonCol,IonImg,IonButton, IonLabel,IonText, IonChip, IonIcon,CopyTextDirective]
})
export class NftPreviewComponent  implements OnInit {
  @Input() nft: NFT;

  constructor( private _modalCtrl: ModalController, public util: UtilService){
    addIcons({copyOutline});
  }
  ngOnInit() {
    console.log(this.nft);
    
  }
  closeModal(){
    this._modalCtrl.dismiss()
  }
  async openModal(componentName: 'list-nft-modal' | 'send-nft-modal' | 'burn-nft-modal') {
    this._modalCtrl.dismiss()
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
        config.desc = `Send your NFT to a different wallet`
        config.btnText = `Send`
        break;
      case 'burn-nft-modal':
        config.imgUrl = 'assets/images/trash-icon.svg'
        config.title = 'Burn'
        config.desc = `Burn your NFT forever`
        config.btnText = `Burn`
        break;
    }
    
    const modal = await this._modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        componentName,
        data: {nfts: [this.nft]},
        config
      },
      cssClass: 'modal-style'
    });
    modal.present();
    // const { data, role } = await modal.onWillDismiss();

  }
}
