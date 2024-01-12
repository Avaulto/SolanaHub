import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import { Validator } from "./stakewiz.model"

export interface WalletExtended {
  balance?: number,
  publicKey: PublicKey,
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>,
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
}
export interface Token{
    type: string,
    networkId: string,
    value: string,
    name: string,
    symbol: string,
    imgUrl: string,
    decimals: number,
    address: string,
    amount: string,
    price: string
}
export interface NFT{
    collectionName: string,
    collectionImgUrl:string,
    imgUrl: string,
    name: string,
    floorPrice: string,
    listed: boolean,
    value: string
}
export interface LiquidityProviding{
    token: Token[]
    platform: string,
    apy: string
}
export interface LendingOrBorrow{
    token: Token[]
    platform: string,
    apy: string
}

export interface StakeAccount {
  lockedDue: string
  locked: boolean
  addr: string
  shortAddr: string
  balance: number
  lamportsBalance: number
  state: 'activating' | 'deactivating' | 'active' | 'inactive'
  validator: Validator
  excessLamport: number
  startEpoch: string
  stakeAuth: string
  withdrawAuth: string
  inflationRewards?: any;
}

export interface TransactionHistory{
    txHash: string
    blockNumber: number
    blockTime: string
    status: boolean
    from: string
    fromShort?: string
    to: string
    toShort?: string
    fee: number
    mainAction: string
    mainActionColor?: string
    balanceChange: BalanceChange[]
    contractLabel?: ContractLabel
  }
  
  export interface BalanceChange {
    amount: number
    symbol?: string
    name?: string
    decimals: number
    address: string
    logoURI?: string
    tokenAccount?: string
    owner?: string
    programId?: string
  }
  
  export interface ContractLabel {
    address: string
    name: string
    metadata: Metadata
  }
  
  export interface Metadata {
    icon: string
  }
  