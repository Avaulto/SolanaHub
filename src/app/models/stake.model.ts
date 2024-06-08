import { Validator } from "./stakewiz.model"


// export interface Stake {
//     type: 'native' | 'liquid'
//     lockedDue?: string
//     locked?: boolean
//     address?: string
//     validatorName?: string
//     shortAddress?: string
//     balance: number
//     value: number
//     state: 'activating' | 'deactivating' | 'active' | 'inactive' | 'directStake' | 'delegationStrategyPool'
//     apy: number
//     imgUrl: string
//     symbol: string
// }
export interface StakeAccountShyft{
    _lamports: number
    meta: {
      lockup: {
        epoch: string
        custodian: string
        unix_timestamp: string
      }
      authorized: {
        staker: string
        withdrawer: string
      }
      rentExemptReserve: string
    }
    stake: {
      delegation: {
        stake: string
        voter: string
        activationEpoch: string
        deactivationEpoch: string
        warmupCooldownRate: number
      }
      creditsObserved: string
    }
    pubkey: string
  }
  
export interface DirectStake {

    mSOL?: {
        amount: string
        tokenOwner: string
        validatorVoteAccount: string
        validator?: Validator
    }
    vSOL?: {
      amount: string
      tokenOwner: string
      validatorVoteAccount: string
      validator?: Validator
  }
    bSOL?: Array<{
        amount: number
        tokenOwner: string
        validatorVoteAccount: string
        validator?: Validator
    }>
    lastCache?: string

}