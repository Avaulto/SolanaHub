import { Injectable, computed, inject } from '@angular/core';
import { PortfolioService } from 'src/app/services';
import { StashAsset, StashGroup } from '../stash.model';
import { HelpersService } from './helpers.service';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { StakeProgram } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class StakeOverflowService {
  constructor(private _helpersService: HelpersService) {

  }
  public findStakeOverflow = computed(() => {
    const accounts = this._helpersService.portfolioService.staking();
    if (!accounts) return null;
    const transactionFee = 30000;
    const filterExceedBalance = accounts
      .filter(acc => acc.state === 'active' && acc.excessLamport > transactionFee && !acc.locked)
      .map(acc => this._helpersService.mapToStashAsset(acc, 'stake'));

    return this._helpersService.createStashGroup(
      'unstaked overflow',
      "Excess balance from your stake account mostly driven by MEV rewards that are not compounded.",
      "harvest",
      filterExceedBalance
    );
  });

  public async withdrawStakeAccountExcessBalance(accounts: StashAsset[], walletOwner: PublicKey) {
    const extractedSOL = accounts.reduce((acc, curr) => acc + curr.extractedValue.SOL, 0)
    const withdrawTx = accounts.map(acc => StakeProgram.withdraw({
      stakePubkey: new PublicKey(acc.account.addr),
      authorizedPubkey: walletOwner,
      toPubkey: walletOwner,
      lamports: acc.extractedValue.SOL * LAMPORTS_PER_SOL, // Withdraw the full balance at the time of the transaction
    }));
    const instructions = withdrawTx.map(ix => ix.instructions)
    return await this._helpersService._simulateBulkSendTx(instructions.flat(), extractedSOL)


    // this._nss.withdraw([account], publicKey, account.extractedValue.SOL * LAMPORTS_PER_SOL)
  }
} 