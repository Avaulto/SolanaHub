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

export interface DirectStake {

    mSOL?: {
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