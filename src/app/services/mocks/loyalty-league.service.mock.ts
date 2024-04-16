import {signal} from "@angular/core";
import {LoyaltyLeaderBoard, LoyaltyScore, NextAirdrop, Platform, PrizePool} from "../../models";
import {LoyaltyLeagueService} from "../loyalty-league.service";
import {Observable, of} from "rxjs";

class LoyaltyLeagueServiceMock {
  walletAssets = signal([]) ;
  llb$= of()

  getLoyaltyScore(): Observable<LoyaltyScore> {
    return of({} as LoyaltyScore)
  }

  getNextAirdrop(): Observable<NextAirdrop> {
    return of({} as NextAirdrop)
  }

  getPrizePool(): Observable<PrizePool> {
    return of({} as PrizePool)
  }

  getLoyaltyLeaderBoard(): Observable<LoyaltyLeaderBoard> {
    return of({} as LoyaltyLeaderBoard)
  }

  addReferral(...args): Observable<PrizePool> {
    return of({} as PrizePool)
  }
}

export const LoyaltyLeagueServiceMockProvider = {
  provide: LoyaltyLeagueService,
  useClass: LoyaltyLeagueServiceMock
}
