import { Injectable, computed, effect } from '@angular/core';
import { BN } from '@marinade.finance/marinade-ts-sdk';
import DLMM from '@meteora-ag/dlmm';
import { Connection, LAMPORTS_PER_SOL, PublicKey, StakeProgram, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { JupStoreService, NativeStakeService, PortfolioService, SolanaHelpersService, TxInterceptorService, UtilService } from 'src/app/services';
export interface StashGroup {
  // networkId: string
  // platformId: string
  // type: string
  label: string
  value: number
  data: {
    assets: StashAsset[]
  }
}
export interface StashAsset {
  name: string,
  symbol: string,
  imgUrl: string,
  balance?: number,
  account: { addr: string, addrShort: string },
  source: string,
  extractedValue: {
    SOL: number;
    USD: number;
  },
  action: string,
  type: string
}
@Injectable({
  providedIn: 'root'
})
export class StashService {

  constructor(
    private _utils: UtilService,
    private _jupStoreService: JupStoreService,
    private _shs: SolanaHelpersService,
    // private _nss: NativeStakeService,
    private _txi: TxInterceptorService,
    private _portfolioService: PortfolioService
  ) {
    effect(() => {

    })
  }
  findNftZeroValue = computed(() => {
    const NFTs = this._portfolioService.nfts()
    if (!NFTs) return null
    const filterNftZeroValue = NFTs.filter(acc => acc.floorPrice < 0.01 && acc.floorPrice == 0)
    const nftZeroValueGroup = {
      label: 'NFT zero value',
      value: 0,
      data: {
        assets: filterNftZeroValue.map(acc => ({
          name: acc.name,
          symbol: acc.symbol,
          imgUrl: acc.image_uri,
          account: this._utils.addrUtil(acc.mint),
          source: 'market value not found',
          extractedValue: { SOL: acc.floorPrice || 0.02, USD: acc.floorPrice || 0.02 * this._jupStoreService.solPrice() },
          action: 'burn',
          type: 'nft'
        }))
      }
    }
    nftZeroValueGroup.value = nftZeroValueGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.USD, 0)
    console.log(nftZeroValueGroup);

    return nftZeroValueGroup

  })
  public findStakeOverflow = computed(() => {
    const accounts = this._portfolioService.staking()
    if (!accounts) return null
    const filterActiveAccounts = accounts.filter(acc => acc.state === 'active')
    const filterExceedBalance = filterActiveAccounts.filter(acc => acc.excessLamport && !acc.locked)
    const unstakedGroup = {
      label: 'Unstaked overflow',
      value: 0,
      data: {
        assets: filterExceedBalance.map(acc => ({
          name: acc.validatorName,
          symbol: acc.symbol,
          imgUrl: acc.imgUrl,
          account: this._utils.addrUtil(acc.address),
          source: 'excess balance',
          extractedValue: { SOL: acc.excessLamport / LAMPORTS_PER_SOL, USD: acc.excessLamport / LAMPORTS_PER_SOL * this._jupStoreService.solPrice() },
          action: 'withdraw',
          type: 'stake-account'
        }))
      }
    }
    unstakedGroup.value = unstakedGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.USD, 0)

    return unstakedGroup
  })
  public findOutOfRangeDeFiPositions = computed(() => {
    const positions = this._portfolioService.defi()
    if (!positions) return null
    // include only positions with out-of-range tag
    const filterOutOfRangePositions = positions.filter(position => position.tags?.includes('Out Of Range'))
    const outOfRangeGroup = {
      label: 'zero yield zones',
      value: 0,
      data: {
        assets: filterOutOfRangePositions.map(acc => ({
          // loop through poolTokens and get the token name and add dash in between
          name: acc.poolTokens.map(token => token.symbol).join('-'),
          symbol: acc.poolTokens.map(token => token.symbol).join('-'),
          imgUrl: acc.poolTokens[0].imgURL,
          account: this._utils.addrUtil('awdawaxaxjnawjan23424asndwadawd'),
          source: 'out of range',
          extractedValue: { SOL: acc.value / this._jupStoreService.solPrice(), USD: acc.value },
          action: 'close',
          type: 'defi-position'
        }))
      }
    }
    outOfRangeGroup.value = outOfRangeGroup.data.assets.reduce((acc, curr) => acc + curr.extractedValue.USD, 0)
    return outOfRangeGroup
  })

  async withdrawStakeAccountExcessBalance(accounts: StashAsset[]) {
    const { publicKey } = this._shs.getCurrentWallet()
    const withdrawTx = accounts.map(acc => StakeProgram.withdraw({
      stakePubkey: new PublicKey(acc.account.addr),
      authorizedPubkey: publicKey,
      toPubkey: publicKey,
      lamports: acc.extractedValue.SOL * LAMPORTS_PER_SOL, // Withdraw the full balance at the time of the transaction
    }));
    console.log(withdrawTx);
    
    await this._txi.sendTx(withdrawTx, publicKey)
    // this._nss.withdraw([account], publicKey, account.extractedValue.SOL * LAMPORTS_PER_SOL)
  }

  async closeOutOfRangeDeFiPosition(positions?: StashAsset[]) {
    try {
      const myWallet = this._shs.getCurrentWallet().publicKey
      const data = {
        "wallet": myWallet.toBase58(),
        "poolAddress": "63qcW5SHA5syE6Pap2NeNMVARMXRA5nCdZFH3Q8cCsi8",
        "positionAddress": "9csMVrHY9j8mUdWBtdPyFfSo37Z6FUg7uuK2aGWVjXMj",
        "binIds": [
          -689,
          -688,
          -687,
          -686,
          -685,
          -684,
          -683,
          -682,
          -681,
          -680,
          -679,
          -678,
          -677,
          -676,
          -675,
          -674,
          -673,
          -672,
          -671,
          -670,
          -669,
          -668,
          -667,
          -666,
          -665,
          -664,
          -663,
          -662,
          -661,
          -660,
          -659,
          -658,
          -657,
          -656,
          -655
      ]
      }
      // const dlmmPool = await DLMM.create(new Connection(this._utils.RPC), new PublicKey(data.poolAddress));
      // console.log(this._utils.RPC);
      
      // // Remove Liquidity
      // let userPositions = []
      //   // Get position state
      //   const positionsState = await dlmmPool.getPositionsByUserAndLbPair(
      //     myWallet
      //   );
      
      //   userPositions = positionsState.userPositions;
      // console.log("🚀 ~ userPositions:", userPositions);
      

      // const removeLiquidityTxs = (
      //   await Promise.all(
      //     userPositions.map(({ publicKey, positionData }) => {
      //       console.log(publicKey, positionData);
            
      //       const binIdsToRemove = positionData.positionBinData.map(
      //         (bin) => bin.binId
      //       );
      //       return dlmmPool.removeLiquidity({
      //         position: publicKey,
      //         user: myWallet,
      //         binIds: binIdsToRemove,
      //         bps: new BN(100 * 100),
      //         shouldClaimAndClose: true, // should claim swap fee and close position together
      //       });
      //     })
      //   )
      // ).flat();

      
      const closePositionTx = await fetch(`${this._utils.serverlessAPI}/api/stash/close-position`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      const tx: Transaction[] = await closePositionTx.json()
      console.log(tx);
      // console.log(tx, publicKey);
      // let txs: Transaction[] = []
      // for (let tx of Array.isArray(removeLiquidityTxs)
      //   ? removeLiquidityTxs
      //   : [removeLiquidityTxs]) {
      //     // Convert Transaction to VersionedTransaction
      //     // const versionedTx = new VersionedTransaction(tx.compileMessage())
      //     txs.push(tx)
      // }
      await this._txi.sendMultipleTxn(tx)
    } catch (error) {
      console.log(error);
      
    }
  }
}
