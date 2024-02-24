import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import { Validator } from "./stakewiz.model"
import { JupToken } from "./jup-token.model"
import { StakePool } from "./stake-pool.model"

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
    extraData?: any
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

export interface Stake {
  type: 'native' | 'liquid'
  lockedDue?: string
  locked?: boolean
  excessLamport?: number
  stakeAuth?: string
  startEpoch?: string
  lastReward?: any
  withdrawAuth?: string
  validator?: Validator
  imgUrl?: string,
  apy?: number,
  pool?: StakePool
  address: string
  validatorName?: string
  shortAddress?: string
  accountLamport?: any
  balance: number
  value?: number
  state: string //'activating' | 'deactivating' | 'active' | 'inactive' | 'directStake' | 'delegationStrategyPool'
  symbol: string
  extraData?: any
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