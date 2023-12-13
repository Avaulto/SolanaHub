
export interface LoyaltyScore {
    nativeStake: number;
    nativeStakeLongTermBoost: number;
    mSOL_DirectStakeBoost:    number;
    bSOL_DirectStakeBoost:    number;
    veMNDE_Boost:             number;
    veBLZE_Boost:             number;
    SolanaHub_Boost:          number;
    hubDomain_Boost:          number;
    referral_Boost:           number;
}
  export interface LoyaltyLeaderBoard {
    loyaltyPoints: LoyaltyPoint[];
    totalPoints:          number;
    snapshotDate:         Date;
}

export interface LoyaltyPoint {
    walletOwner:     string;
    loyaltyPoints:   number;
    pointsBreakDown: PointsBreakDown;
    prizePoolShare:  number;
    prize?: number
}

export interface PointsBreakDown {
    nativeStakePts: number;
    bSOLpts:        number;
    mSOLpts:        number;
    veMNDEpts:      number;
    veBLZEpts:      number;
    referralPts:    number;
    hubDomainHolder:   number;
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