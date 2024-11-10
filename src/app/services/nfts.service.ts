import { Injectable } from '@angular/core';
import { NFT } from '../models';
import { PublicKey, Transaction } from '@solana/web3.js';
import { UtilService } from './util.service';
interface BurnIns{
  success: boolean
  message: string
  result: {
    encoded_transactions: Array<string>
  }
}

@Injectable({
  providedIn: 'root'
})
export class NftsService {

  constructor(private _utils: UtilService) { }
  async burnNft(nftsAddress: string[], walletOwner: string): Promise<Transaction[]> {
    try {
      const aggregateNFTs = nftsAddress.map(nftAddress => { return {address: nftAddress}})
      const getBurnIns = await fetch(this._utils.serverlessAPI + '/api/nft/burn',{
        method:'POST',
        body: JSON.stringify({nftAddresses: aggregateNFTs, walletOwner})
      })
      const decodeBurnRes:BurnIns = await getBurnIns.json()
      const encodedIx: string[] = decodeBurnRes.result.encoded_transactions
      
      const txInsArray: Transaction[] = encodedIx.map(ix => Transaction.from(Buffer.from(ix, 'base64')))

      return txInsArray
    } catch (error) {
      return error
    }
  }
  async transferNft(nfts: NFT[], from_address: string, to_address: string): Promise<Transaction[]> {
    try {
        const aggregateNFTs =  nfts.map(nft => nft.mint)
      const getTransferIns = await fetch(this._utils.serverlessAPI + '/api/nft/transfer',{
        method:'POST',
        body: JSON.stringify({token_addresses: aggregateNFTs, from_address, to_address})
      })
      const decodeTransferRes:BurnIns = await getTransferIns.json()
      const encodedIx: string[] = decodeTransferRes.result.encoded_transactions
      
      const txInsArray: Transaction[] = encodedIx.map(ix => Transaction.from(Buffer.from(ix, 'base64')))

      return txInsArray
    } catch (error) {
      return error
    }
  }
}
