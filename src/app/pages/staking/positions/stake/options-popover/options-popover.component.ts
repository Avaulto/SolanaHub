import { Component, Input, OnInit } from '@angular/core';
import {
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { StakeAccount } from 'src/app/models';
import { addIcons } from 'ionicons';
import { arrowUp, arrowDown, people, peopleCircle, flash, paperPlane } from 'ionicons/icons';
import { NativeStakeService, SolanaHelpersService } from 'src/app/services';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../../modal/modal.component';
@Component({
  selector: 'options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class OptionsPopoverComponent implements OnInit {
  @Input() stakeAccount: StakeAccount;
  @Input() stakeAccounts: StakeAccount[];
  constructor(
    private _modalCtrl: ModalController,
    private _shs: SolanaHelpersService,
    private _nss: NativeStakeService
  ) {
    addIcons({ arrowUp, arrowDown, people, peopleCircle, flash, paperPlane });
  }

  ngOnInit() {

  }
  public async unStake() {
    const walletOwner = this._shs.getCurrentWallet()
    await this._nss.deactivateStakeAccount(this.stakeAccount.address, walletOwner)
  }
  public async reStake() {
    const walletOwner = this._shs.getCurrentWallet()
    await this._nss.reStake(this.stakeAccount, walletOwner)
  }
  public async withdraw() {
    const walletOwner = this._shs.getCurrentWallet()
    await this._nss.withdraw(this.stakeAccount, walletOwner)

    const stakeBalance = await this._shs.connection.getBalance(new PublicKey(this.stakeAccount.address));
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);
  }

  async openModal(componentName: 'instant-unstake-modal' | 'merge-modal' | 'split-modal' | 'transfer-auth-modal') {
    let config = {
      imgUrl: null,
      title: null,
      desc: null,
      btnText: null
    }
    switch (componentName) {
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
        data: {stakeAccount: this.stakeAccount, stakeAccounts: this.stakeAccounts},
        config
      },
      cssClass: 'modal-style'
    });
    modal.present();
    // const { data, role } = await modal.onWillDismiss();

  }
}
