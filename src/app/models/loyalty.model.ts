import { Observable } from "rxjs"

export interface Multipliers {
  _id?: string
  SOL: number
  hubSOL: number
  vSOL: number
  bSOL: number
  veMNDE: number
  veBLZE: number
  referrals: number
  ambassador: number
  hubSOLDeFiBoost: {
    orca: number
    solblaze: number
    kamino: number
    meteora: number
    "the-vault": number
    raydium: number
    mango: number
    solayer: number
    texture: number
    rainfi: number
  }
  questBonusPoints: {
    loyalBoost: {
      degen: number
      manlet: number
      maxi: number
      diamondHand: number
    }
    hubDomain: number
  }
  date: string
}

<<<<<<< HEAD
export interface loyalMember {
    walletOwner:     string;
    loyaltyPoints:   any;
    pointsBreakDown: PointsBreakDown;
    hubDomainHolder: string;
    prizePoolShare:  number;
    airdrop?: number
}
=======
>>>>>>> main

export interface Season{
  airdrop: number
  season: number
  lastUpdate: Date
  totalPoints: number
  totalParticipants: number
  startDate: Date
  endDate: Date
}

export interface loyaltyLeagueMember {
  prizePoolShare?: number
  lastUpdated?: Date,
  totalPtsAnimation?: Observable<number>
  hubDomain?: string,
  referralCode?: string,
  ambassadorPts?: number,
  questsPts?: number,
  walletOwner: string,
  totalPts: number,
  stakingPts: number,
  daoPts: number,
  referralPts: number,
  daysLoyal: number,
}


export interface Tier {
  title: string;
  points: number;
  icon: string;
  iconFull: string;
  loyaltyDaysRequirement: number;
}