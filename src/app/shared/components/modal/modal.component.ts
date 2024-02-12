import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StakeAccount, Validator } from 'src/app/models';
import { IonButton, IonImg } from '@ionic/angular/standalone'

import { NativeStakeService, SolanaHelpersService } from 'src/app/services';
import { PublicKey } from '@solana/web3.js';
import { ValidatorsModalComponent } from 'src/app/pages/staking/form/validators-modal/validators-modal.component';
import { InstantUnstakeModalComponent } from 'src/app/pages/staking/positions/stake/instant-unstake-modal/instant-unstake-modal.component';
import { MergeModalComponent } from 'src/app/pages/staking/positions/stake/merge-modal/merge-modal.component';
import { SplitModalComponent } from 'src/app/pages/staking/positions/stake/split-modal/split-modal.component';
import { TransferAuthModalComponent } from 'src/app/pages/staking/positions/stake/transfer-auth-modal/transfer-auth-modal.component';
import { TokenListComponent } from 'src/app/pages/swap/token-list/token-list.component';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonImg,
    ValidatorsModalComponent,
    InstantUnstakeModalComponent,
    MergeModalComponent,
    SplitModalComponent,
    TransferAuthModalComponent,
    TokenListComponent
  ]

})
export class ModalComponent implements AfterViewInit {
  public onSubmit: boolean = false;
  @Input() config = {
    imgUrl: null,
    title: null,
    desc: null,
    btnText: null
  }
  @Input() data
  @Input() componentName: 'validators-modal' | 'merge-modal' | 'split-modal' | 'instant-unstake-modal' | 'transfer-auth-modal' | 'token-list'
  public emittedValue = signal(null)
  constructor(
    private _modalCtrl: ModalController,
    private _shs: SolanaHelpersService,
    private _nss: NativeStakeService
  ) {
    effect(() => console.log(this.data.jupTokens(), this.emittedValue()))
  }

  ngAfterViewInit() {
    
    
  }
  async submit() {

    const wallet = this._shs.getCurrentWallet()
    switch (this.componentName) {
      case 'split-modal':

        await this._nss.splitStakeAccounts(wallet.publicKey,  new PublicKey(this.data.stakeAccount.addr), this.emittedValue().newStakeAccount, this.emittedValue().amount)
        break;
      case 'merge-modal':

        const accountsToMerge = this.emittedValue().accountsToMerge.map((acc: StakeAccount) => new PublicKey(acc.address))
        await this._nss.mergeStakeAccounts(wallet.publicKey,  new PublicKey(this.data.stakeAccount.addr), accountsToMerge);
        break;
      case 'transfer-auth-modal':
        const targetAddress = new PublicKey(this.emittedValue().targetAddress)
        const authToTransfer = this.emittedValue().authorities;
        await this._nss.transferStakeAccountAuth( new PublicKey(this.data.stakeAccount.addr),wallet.publicKey, targetAddress, authToTransfer);

        break;
      default:
        break;
    }
    this.closeModal()
  }
  closeModal() {
    this._modalCtrl.dismiss(this.emittedValue())
  }


}
