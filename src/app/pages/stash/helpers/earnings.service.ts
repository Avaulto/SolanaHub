import { Injectable, computed, inject, signal } from '@angular/core';
import { PortfolioService, UtilService } from 'src/app/services';
import { StashAsset, StashGroup } from '../stash.model';
import { HelpersService } from './helpers.service';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { environment } from 'src/environments/environment';

interface Stash {
  stashReferralAddress: string
  stashUser: StashUser
}
interface StashUser {
  refCode: string
  walletOwner: string
  extractedSOL: number
  referralFee: number
}

interface StashRecord {
  txs: string[]
  extractedSOL?: number
  walletOwner: string,
  referralFee?: number
}

export interface PlatformUsageRecord {
  [key: string]: number | string[];
  txn: string[];
  platformFeePaid: number;
  referralFeePaid: number;
}


@Injectable({
  providedIn: 'root'
})
export class EarningsService {
  private _stashUserSignal = signal<StashUser>(null)
  private _referralAddressSignal = signal<string>(null)

  public stashUser = computed(() => this._stashUserSignal())
  public referralAddress = computed(() => this._referralAddressSignal())
  constructor(
    private _utils: UtilService
  ) {

  }
  public async getOrCreateUser(walletOwner: PublicKey, refCode: string): Promise<void> {
    try {
      const user: Stash = await (await fetch(`${this._utils.serverlessAPI}/api/stash/user/getOrCreateReferral?walletAddress=${walletOwner.toBase58()}&refCode=${refCode}`)).json()
      this._stashUserSignal.set(user.stashUser)
      this._referralAddressSignal.set(user.stashReferralAddress)
    } catch (error) {
      console.error(error)
    }
  }


  public async storeRecord(
    stashUserRecord: StashRecord,
    stashReferralRecord: StashRecord
  ): Promise<void> {
    try {
     
      const stashUser: StashUser = await (await fetch(`${this._utils.serverlessAPI}/api/stash/user/store-user-record`, {
        method: 'POST',
        body: JSON.stringify({
          userRecord: stashUserRecord,
          referralRecord: stashReferralRecord
        })
      })).json()
      this._stashUserSignal.set(stashUser)
    } catch (error) {
      console.error(error)
    }
  }

  public async updatePlatformRecord(
    positionsCount: number,
    type: string,
    extractedSOL: number,
    platformFee: number,
    referralFee: number,
    signatures: string[]
  ): Promise<void> {
    // map through stashAssets to update platformRecord
    const typeCount = type + '-count'
    const extractedSOLType = type + '-extractedSOL'
    console.log('all stats', typeCount, extractedSOLType, positionsCount, extractedSOL, platformFee, referralFee, signatures);
    const platformRecord: PlatformUsageRecord = {
      [typeCount]: positionsCount,
      [extractedSOLType]: extractedSOL,
      txn: signatures,
      platformFeePaid: platformFee,
      referralFeePaid: referralFee
    }
    console.log('platformRecord', platformRecord);
    
    try {
     
       await (await fetch(`${this._utils.serverlessAPI}/api/stash/user/store-platform-record`, {
        method: 'POST',
        body: JSON.stringify({
          platformRecord
        })
      })).json()
   
    } catch (error) {
      console.error(error)
    }
  }


} 
