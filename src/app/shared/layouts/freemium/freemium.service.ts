import { computed, effect, Injectable, signal } from '@angular/core';
import { LocalStorageService, SolanaHelpersService } from 'src/app/services';
import va from '@vercel/analytics';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FreemiumService {
  public readonly isPremium = computed(() => this._isPremium());

  private _premiumServices: string[] = [];
  private _platformFee: number | null = null;
  private _hideAd = signal(this.getAdConfig());
  private _isPremiumCache = new Map<string, boolean>();
  private _isPremium = signal<boolean | null>(null);

  constructor(
    private _shs: SolanaHelpersService,
    private _storageService: LocalStorageService,
  ) {
    this._initializeService();
    effect(() => {
      this._updateIsPremium();
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

  public addServiceFee(walletPk: PublicKey, type: string): TransactionInstruction | null {
    if (this.isPremium() || !this._premiumServices.includes(type)) {
      return null;
    }

    const fee = this._platformFee ?? 3000000; // Default to 0.003 SOL if platform fee is not set
    return SystemProgram.transfer({
      fromPubkey: walletPk,
      toPubkey: new PublicKey(environment.platformFeeCollector),
      lamports: fee,
    });
  }

  // public isPremium = computed(async () => {
  //   const walletAddress = this._shs.wallet()?.publicKey?.toString();
  //   if (!walletAddress) return null;
  //   return await this._fetchIsPremium(walletAddress);
  // });
  private async _fetchIsPremium(walletAddress: string): Promise<boolean | null> {
    if (this._isPremiumCache.has(walletAddress)) {
      return this._isPremiumCache.get(walletAddress)!;
    }
  
    try {
      const response = await fetch(`${environment.apiUrl}/api/freemium/get-is-premium?walletAddress=${walletAddress}`);
      const data = await response.json();
      this._isPremiumCache.set(walletAddress, data.isPremium);
      this._isPremium.set(data.isPremium);
      return data.isPremium;
    } catch (error) {
      console.error('Error fetching premium status:', error);
      return null;
    }
  }


  private async _updateIsPremium(): Promise<void> {
    const walletAddress = this._shs.wallet()?.publicKey?.toString();
    if (!walletAddress) {
      this._isPremium.set(null);
      return;
    }
    const isPremium = await this._fetchIsPremium(walletAddress);
    this._isPremium.set(isPremium);
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
