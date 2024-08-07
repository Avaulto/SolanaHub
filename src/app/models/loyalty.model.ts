
export interface LoyaltyBooster {
    nativeStake: number;
    nativeStakeLongTermBoost: number;
    hubSOL_DirectStakeBoost:    number;
    hubSOL_DeFiBoost:    number;
    mSOL_DirectStakeBoost:    number;
    vSOL_DirectStakeBoost:    number;
    bSOL_DirectStakeBoost:    number;
    veMNDE_Boost:             number;
    veBLZE_Boost:             number;
    SolanaHub_Boost:          number;
    hubDomain_Boost:          number;
    referral_Boost:           number;
}
  export interface LoyaltyLeaderBoard {
    loyaltyLeagueMembers: loyalMember[];
    totalPoints:          number;
    snapshotDate:         Date;
}

export interface loyalMember {
    walletOwner:     string;
    loyaltyPoints:   any;
    pointsBreakDown: PointsBreakDown;
    hubDomainHolder: string;
    prizePoolShare:  number;
    airdrop?: number
}

export interface PointsBreakDown {
    nativeStakePts: number;
    bSOLpts:        number;
    mSOLpts:        number;
    ambassadorPts?: number;
    vSOLpts:        number;
    hubSOLpts:      number;
    veMNDEpts:      number;
    veBLZEpts:      number;
    referralPts:    number;
    hubDomainPts:   number;
}


export interface PrizePool {
    rebates: number
    hubSOLrebates: number
    avgApyBoost: number
    APY_boosters: {
      MNDE: number
      BLZE: number
      SOL: number
      bSOL: number
      hubSOL: number
      mSOL: number
    }
    breakdown: {
      weekly_BLZE_emmistion: number
      weekly_BLZE_TO_SOL_emmistion: number
      weeklyDirectStake: number
      directStakeRebate: number
      blzeRebate: number
    }
  }
  

export interface NextAirdrop{
    nextAirdrop: Date,
    days: number,
    hours: number,
    desc?:string
}