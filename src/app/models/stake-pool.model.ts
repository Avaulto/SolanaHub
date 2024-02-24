export interface StakePool{
    poolName: string
    apy: number
    exchangeRate: number
    tokenSymbol: string
    tokenMint: string
    tokenImageURL: string
    poolPublicKey: string
    MEVDelegation: boolean
    website: string
    tokenMintSupply: number
    commission: number
    solDepositFee: number
    solWithdrawalFee: number
    totalStake: number
    reserveSol: number
  }
  