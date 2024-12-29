import { computed, effect, Injectable, signal } from '@angular/core';
import { LocalStorageService, PortfolioService, SolanaHelpersService } from 'src/app/services';
import va from '@vercel/analytics';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { environment } from 'src/environments/environment';
import { WalletExtended } from '../models';

interface Account {
  isPremium: boolean;
  stake: number;
}

@Injectable({
  providedIn: 'root'
})
export class FreemiumService {
  /**
  @param isOwner has solanahub pass
  @param isPremium active state subscription of solanahub pass
  */
  public readonly isPremium = computed(() => this._account()?.isPremium ?? null);

  private _account = signal<Account | null>(null);
  private _premiumServices: string[] = [];
  private _platformFee: number | null = null;
  private _hideAd = signal(this.getAdConfig());
  private _isPremiumCache = new Map<string, Account>();

  constructor(
    private _portfolioService: PortfolioService,
    private _shs: SolanaHelpersService,
    private _storageService: LocalStorageService,
  ) {
    this._initializeService();
    this._shs.walletExtended$.subscribe((wallet) => {
      if (wallet) {
        console.log('wallet', wallet);
        this._updateAccount(wallet);
      }
    });
  }

  private async _initializeService(): Promise<void> {
    await Promise.all([
      this._fetchPremiumServices(),
      this._fetchPlatformFee(),
    ]);
  }

  private async _fetchPremiumServices(): Promise<void> {
    try {
      const response = await fetch(`${environment.apiUrl}/api/freemium/get-premium-services`);
      const data = await response.json();
      this._premiumServices = data.premiumServices;
    } catch (error) {
      console.error('Error fetching premium services:', error);
    }
  }

  private async _fetchPlatformFee(): Promise<void> {
    try {
      const response = await fetch(`${environment.apiUrl}/api/freemium/get-platform-fee`);
      const data = await response.json();
      this._platformFee = data.platformFee;
    } catch (error) {
      console.error('Error fetching platform fee:', error);
    }
  }

  /**
   * this function is used to add platform fee to the transaction or wave it if user is premium user
   * platform fee wont be added if transaction already has platform fee defined in previous code flow
   * 
   * @param hasFeeSetup check if transaction setup already have platform fee defined in previous code flow
   * @param isPremiumUser check if user is premium user
   * @returns 
   */
  public addPlatformFee(walletPk: PublicKey, type: string): TransactionInstruction | null {
    if (this.isPremium() || !this._premiumServices.includes(type)) {
      return null;
    }

    const fee = this._platformFee ?? 2000000; // Default to 0.003 SOL if platform fee is not set
    return SystemProgram.transfer({
      fromPubkey: walletPk,
      toPubkey: new PublicKey(environment.platformFeeCollector),
      lamports: fee,
    });
  }

  private async _fetchAccount(walletAddress: string): Promise<Account | null> {
    if (this._isPremiumCache.has(walletAddress)) {
      return this._isPremiumCache.get(walletAddress)!;
    }
  
    try {
     
      // check if wallet own solanahub pass nft
      const isPremium = await(await fetch(`${environment.apiUrl}/api/freemium/is-premium?walletAddress=${walletAddress}`)).json();
      console.log(isPremium);
      
  
      let data = null;
      this._isPremiumCache.set(walletAddress, data);
      this._account.set(data);
      return data;
    } catch (error) {
      console.error('Error fetching account data:', error);
      return null;
    }
  }

  private async _updateAccount(wallet: WalletExtended): Promise<void> {
    const walletAddress = wallet.publicKey?.toString();
    console.log(walletAddress);
    
    if (!walletAddress) {
      this._account.set(null);
      return;
    }
    const account = await this._fetchAccount(walletAddress);
    this._account.set(account);
  }

  public hideAd(): void {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    this._storageService.saveData('hideFreemiumAd', expirationDate.toISOString());
    this._hideAdEvent();
    this._hideAd.set(true);
  }

  public getAdConfig(): boolean {
    const savedDate = this._storageService.getData('hideFreemiumAd');
    if (savedDate) {
      const expirationDate = new Date(savedDate);
      if (expirationDate > new Date()) {
        return true;
      } else {
        this._storageService.removeData('hideFreemiumAd');
      }
    }
    return false;
  }

  public readonly adShouldShow = computed(() => {
    const isPremium = this.isPremium();
    if (isPremium === null) return null;
    return !isPremium && !this._hideAd();
  });

  private _hideAdEvent(): void {
    va.track('hide freemium ad');
  }
}
