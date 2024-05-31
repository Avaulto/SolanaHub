import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import { Validator } from "./stakewiz.model"
import { JupToken } from "./jup-token.model"
import { StakePool } from "./stake-pool.model"
import { Observable } from "rxjs";

export interface WalletExtended {
  balance?: number,
  publicKey: PublicKey,
  signMessage(message: Uint8Array): Observable<Uint8Array> | undefined;
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>,
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
}
export interface Token extends JupToken{
    type?: string,
    networkId?: string,
    imgUrl?: string,
    value?: string,
    price?: number
    amount?: string
    extraData?: any
}
export interface NFT{
  name: string
  symbol: string
  royalty: number
  image_uri: string
  cached_image_uri: string
  animation_url: string
  cached_animation_url: string
  metadata_uri: string
  description: string
  mint: string
  owner: string
  update_authority: string
  creators: Array<{
    address: string
    share: number
    verified: boolean
  }>
  collection: {
    address: string
    verified: boolean
  }
  attributes: {
    Gender: string
    Type: string
    Expression: string
    Hair: string
    Eyes: string
    Clothing: string
    Hand: string
    Glove: string
    Background: string
  }
  attributes_array: Array<{
    trait_type: string
    value: string
  }>
  files: Array<{
    uri: string
    type: string
  }>
  external_url: string
  is_loaded_metadata: boolean
  primary_sale_happened: boolean
  is_mutable: boolean
  token_standard: string
  is_compressed: boolean
  merkle_tree: string
  is_burnt: boolean
  type: string
  value: any
}

// export interface NFT{
//   type: string
//   checked?: boolean
//   attributes: {
//     tags: Array<string>
//   }
//   data: {
//     address: string
//     amount: number
//     price: any
//     name: string
//     dataUri: string
//     imageUri: string
//     attributes: Array<{
//       value: string
//       trait_type: string
//     }>
//     collection: {
//       floorPrice: any
//       id: string
//       name: string
//     }
//   }
//   networkId: string
//   value: any
// }
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
  lockedDue?: Date
  locked?: boolean
  excessLamport?: number
  stakeAuth?: string
  startEpoch?: string
  lastReward?: any
  withdrawAuth?: string
  delegatedLamport?: number,
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
  link?: string
}

export interface TransactionHistory{
    txHash: string
    timestamp: string
    from: string
    to: string
    fee: number
    mainAction: string
    mainActionColor?: string
    balanceChange: BalanceChange[]
    contractLabel?: ContractLabel;
    case: string;
  }
  
  export interface BalanceChange {
    type: 'in' | 'out',
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
    platform?:  string;
    imgURL:     string;
    type:       string;
    value:      number;
    link:       string;
    holdings: holding[]
  }
  
  export interface PoolToken {
    imgURL: string;
    symbol: string;
    decimals?: number;
    address:string;
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