import { Injectable } from '@angular/core';
import { DialectSdk, Dialect, BlockchainSdk, ReadOnlyDapp } from '@dialectlabs/sdk';
import {
  Solana,
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter
} from '@dialectlabs/blockchain-sdk-solana';
import { SolanaHelpersService } from './solana-helpers.service';
import { Keypair } from '@solana/web3.js';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _dialectSDK: DialectSdk<BlockchainSdk>
  constructor(private _shs: SolanaHelpersService) {
    this.createSdk()
  }
  public createSdk() {
    this._dialectSDK = Dialect.sdk(
      {
        environment: 'production',
      },
      SolanaSdkFactory.create({
        wallet: this._shs.getCurrentWallet() as NodeDialectSolanaWalletAdapter,//NodeDialectSolanaWalletAdapter.create(Keypair.generate()), // this._shs.getCurrentWallet() as NodeDialectSolanaWalletAdapter
      }),
    );
    return this._dialectSDK
  }
  public async getDapps(): Promise<ReadOnlyDapp[]> {
    const dapps = await this._dialectSDK.dapps.findAll({
      verified: true,
    })
    return dapps
  }
  public async subscribe(addressId: string, dappPublicKey: string) {
    const subscription = await this._dialectSDK.wallet.dappAddresses.create({
      addressId,
      enabled: true,
      dappAccountAddress: dappPublicKey
    })
    return subscription
  }
  public async getMessages() {
    const sdk1Messages = await this._dialectSDK.wallet.messages.findAllFromDapps({
      dappVerified: false,
    });
    return sdk1Messages
  }
}
