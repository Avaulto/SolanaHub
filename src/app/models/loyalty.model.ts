
export interface LoyaltyScore {
    nativeStake: number;
    nativeStakeLongTermBoost: number;
    hubSOL_DirectStakeBoost:    number;
    hubSOL_DeFiBoost:    number;
    mSOL_DirectStakeBoost:    number;
    bSOL_DirectStakeBoost:    number;
    veMNDE_Boost:             number;
    veBLZE_Boost:             number;
    SolanaHub_Boost:          number;
    hubDomain_Boost:          number;
    referral_Boost:           number;
}
  export interface LoyaltyLeaderBoard {
    loyaltyPoints: loyalMember[];
    totalPoints:          number;
    snapshotDate:         Date;
}

export interface loyalMember {
    walletOwner:     string;
    loyaltyPoints:   number;
    pointsBreakDown: PointsBreakDown;
    hubDomainHolder: string;
    prizePoolShare:  number;
    airdrop?: number
}

export interface PointsBreakDown {
    nativeStakePts: number;
    bSOLpts:        number;
    mSOLpts:        number;
    hubSOLpts:       number;
    veMNDEpts:      number;
    veBLZEpts:      number;
    referralPts:    number;
    hubDomainPts:   number;
}


export interface PrizePool {
    rebates: number;
    APR_boost: number;
}

export interface NextAirdrop{
    nextAirdrop: Date,
    days: number,
    hours: number,
    desc?:string
}