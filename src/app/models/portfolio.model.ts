import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import { Validator } from "./stakewiz.model"
import { JupToken } from "./jup-token.model"

export interface WalletExtended {
  balance?: number,
  publicKey: PublicKey,
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>,
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
}
export interface Token extends JupToken{
    type?: string,
    networkId?: string,
    imgUrl?: string,
    value?: string,
    price?: string
    amount?: string
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
  lockedDue?: string
  locked?: boolean
  lamportsBalance?: number
  excessLamport?: number
  stakeAuth?: string
  startEpoch?: string
  withdrawAuth?: string
  validator?: Validator
  address: string
  shortAddress: string
  balance: number
  state: 'active' | 'inactive' | 'activating' | 'deactivating'
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
  
  export interface defiHolding {
    poolTokens: PoolToken[];
    imgURL:     string;
    type:       string;
    value:      number;
    link:       string;
    holdings: holding[]
}

export interface PoolToken {
    imgURL: string;
    symbol: string;
}
export interface holding {
  balance: string;
  symbol: string;
}


  export interface Platform {
    id: string
    name: string
    description: string
    image: string
    discord: string
    twitter: string
    website: string
    medium: string
  }