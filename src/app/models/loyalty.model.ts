
export interface Multipliers {
  SOL: number,
  hubSOL: number,
  vSOL: number,
  bSOL: number,
  veMNDE: number,
  veBLZE: number,
  hubSOLDeFiBoost: number,
  bonusPoints: {
      hubDomain: number,
      referrals: number,
      loyalBoost: {
        degen: number,
        manlet: number,
        maxi: number,
        diamondHand:number
      },
      ambassador: number,
    }
}

export interface Season{
  airdrop: number
  season: number
  totalPoints: number
  totalParticipants: number
  startDate: Date
  endDate: Date
}
export interface LeaderBoard {
  loyaltyLeagueMembers: loyaltyLeagueMember[]
  totalPoints: number
}
export interface loyaltyLeagueMember {
  hubDomain?: string,
  walletOwner: string,
  totalPts: number,
  stakingPts: number,
  daoPts: number,
  questsPts: number,
  ambassadorPts: number,
  referralPts: number,
  referralCode: string,
  daysLoyal: number,
}


export interface Tier {
  title: string;
  points: number;
  icon: string;
  iconFull: string;
  loyaltyDaysRequirement: number;
}