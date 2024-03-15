import { Component, Input, OnInit } from '@angular/core';
import {
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { Stake } from 'src/app/models';
import { addIcons } from 'ionicons';
import { arrowUp, arrowDown, people, peopleCircle, flash, paperPlane, water } from 'ionicons/icons';
import { NativeStakeService, SolanaHelpersService } from 'src/app/services';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon,RouterLink]
})
export class OptionsPopoverComponent implements OnInit {
  @Input() stake: Stake;
  @Input() stakeAccounts: Stake[];
  constructor(
    private _modalCtrl: ModalController,
    private _shs: SolanaHelpersService,
    private _nss: NativeStakeService
  ) {
    addIcons({ arrowUp, arrowDown, people, peopleCircle, flash, paperPlane, water });
  }

  ngOnInit() {

  }
  public async unStake() {
    const walletOwner = this._shs.getCurrentWallet()
    await this._nss.deactivateStakeAccount(this.stake.address, walletOwner)
  }
  public async reStake() {
    const walletOwner = this._shs.getCurrentWallet()
    await this._nss.reStake(this.stake, walletOwner)
  }
  public async withdraw() {
    const walletOwner = this._shs.getCurrentWallet()
    await this._nss.withdraw(this.stake, walletOwner)
  }

  async openModal(componentName: 'delegate-lst-modal' | 'instant-unstake-modal' | 'merge-modal' | 'split-modal' | 'transfer-auth-modal') {
    let config = {
      imgUrl: null,
      title: null,
      desc: null,
      btnText: null
    }
    switch (componentName) {
      case 'delegate-lst-modal':
        config.imgUrl = 'assets/images/droplets-icon.svg'
        config.title = 'liquid staking'
        config.desc = 'Turn your stake account into a liquid stake token'
        config.btnText = 'delegate now'
        break;
      case 'instant-unstake-modal':
        config.imgUrl = 'assets/images/bolt-icon.svg'
        config.title = 'Instantly unstake your SOL'
        config.desc = 'Instantly unstake your SOL power by sanctum'
        config.btnText = 'unstake now'
        break;
      case 'merge-modal':
        config.imgUrl = 'assets/images/merge-icon.svg'
        config.title = 'merge your accounts'
        config.desc = 'you can merge only accounts with the same validator and status'
        config.btnText = 'merge selected accounts'
        break;
      case 'split-modal':
        config.imgUrl = 'assets/images/split-icon.svg'
        config.title = 'Split account'
        config.desc = 'you can split your accounts into 2 separate accounts'
        config.btnText = 'split stake account'
        break;
      case 'transfer-auth-modal':
        config.imgUrl = 'assets/images/transfer-auth-icon.svg'
        config.title = 'transfer account authority'
        config.desc = 'transfer your stake or withdraw authority to a new wallet'
        config.btnText = 'transfer authorization'
        break;
      default:
        break;
    }
    
    const modal = await this._modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        componentName,
        data: {stake: this.stake, stakeAccounts: this.stakeAccounts},
        config
      },
      cssClass: 'modal-style'
    });
    modal.present();
    // const { data, role } = await modal.onWillDismiss();

  }
}
