import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NFT, Stake, Validator } from 'src/app/models';
import { IonButton, IonImg } from '@ionic/angular/standalone'

import { NativeStakeService, SolanaHelpersService, TxInterceptorService } from 'src/app/services';
import { PublicKey } from '@solana/web3.js';
import { ValidatorsModalComponent } from 'src/app/pages/staking/form/validators-modal/validators-modal.component';
import { InstantUnstakeModalComponent } from 'src/app/pages/staking/positions/stake/instant-unstake-modal/instant-unstake-modal.component';
import { MergeModalComponent } from 'src/app/pages/staking/positions/stake/merge-modal/merge-modal.component';
import { SplitModalComponent } from 'src/app/pages/staking/positions/stake/split-modal/split-modal.component';
import { TransferAuthModalComponent } from 'src/app/pages/staking/positions/stake/transfer-auth-modal/transfer-auth-modal.component';
import { TokenListComponent } from 'src/app/pages/swap/token-list/token-list.component';
import { DelegateLSTModalComponent } from 'src/app/pages/staking/positions/stake/delegate-lst/delegate-lst-modal.component';
import { LiquidStakeService } from 'src/app/services/liquid-stake.service';
import { SendNftModalComponent } from 'src/app/pages/collectibles/send-nft-modal/send-nft-modal.component';
import { ListNftModalComponent } from 'src/app/pages/collectibles/list-nft-modal/list-nft-modal.component';
import { BurnNftModalComponent } from 'src/app/pages/collectibles/burn-nft-modal/burn-nft-modal.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonImg,
    ValidatorsModalComponent,
    DelegateLSTModalComponent,
    InstantUnstakeModalComponent,
    MergeModalComponent,
    SplitModalComponent,
    TransferAuthModalComponent,
    TokenListComponent,
    SendNftModalComponent,
    ListNftModalComponent,
    BurnNftModalComponent
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
  @Input() componentName: 'list-nft-modal' | 'send-nft-modal' | 'burn-nft-modal' | 'delegate-lst-modal' | 'validators-modal' | 'merge-modal' | 'split-modal' | 'instant-unstake-modal' | 'transfer-auth-modal' | 'token-list'
  public emittedValue = signal(null)
  constructor(
    private _modalCtrl: ModalController,
    private _shs: SolanaHelpersService,
    private _nss: NativeStakeService,
    private _lss: LiquidStakeService,
    private _txi: TxInterceptorService
  ) {
  }

  ngAfterViewInit() {

  }
  async submit() {

    const wallet = this._shs.getCurrentWallet()
    switch (this.componentName) {
      case 'delegate-lst-modal':
        const pool = this.emittedValue().pool;

        this._lss.stakePoolStakeAccount(this.data.stake, pool)
        break;
      case 'split-modal':

        this._nss.splitStakeAccounts(wallet.publicKey, new PublicKey(this.data.stake.address), this.emittedValue().newStakeAccount, this.emittedValue().amount)
        break;
      case 'merge-modal':

        const accountsToMerge = this.emittedValue().accountsToMerge.map((acc: Stake) => new PublicKey(acc.address))
        this._nss.mergeStakeAccounts(wallet.publicKey, new PublicKey(this.data.stake.address), accountsToMerge);
        break;
      case 'transfer-auth-modal':
        const targetAddress = new PublicKey(this.emittedValue().targetAddress)
        const authToTransfer = this.emittedValue().authorities;
        this._nss.transferStakeAccountAuth(new PublicKey(this.data.stake.address), wallet.publicKey, targetAddress, authToTransfer);

        break;

      case 'burn-nft-modal':
        const nftsToBurn: NFT[] = this.emittedValue().nftsToBurn;
        let burnIns = await this._shs.burnNft(nftsToBurn[0].data.address, wallet.publicKey);
        this._txi.sendTx([burnIns], wallet.publicKey)
        break;
      case 'send-nft-modal':
        const nftsToSend: NFT[] = this.emittedValue().nftsToSend;
        const newTargetAddress = this.emittedValue().targetAddress
        let sendIns = await this._shs.sendSplOrNft(new PublicKey(nftsToSend[0].data.address), wallet.publicKey, newTargetAddress,1);
        this._txi.sendTx(sendIns, wallet.publicKey)
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
