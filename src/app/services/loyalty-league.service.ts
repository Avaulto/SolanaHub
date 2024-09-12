import { Injectable, effect, signal } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, firstValueFrom, map, of, shareReplay } from 'rxjs';
import { LeaderBoard, loyaltyLeagueMember, Multipliers, Season } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyLeagueService {
  // private _loyaltyLeagueLeaderBoard$ = new BehaviorSubject(null as LoyaltyLeaderBoard);
  // public llb$ = this._loyaltyLeagueLeaderBoard$.asObservable().pipe(this._utilService.isNotNullOrUndefined)

  // private _loyaltyLeaguePrizePool$ = new BehaviorSubject(null as PrizePool);
  // public llPrizePool$ = this._loyaltyLeaguePrizePool$.asObservable().pipe(this._utilService.isNotNullOrUndefined)

  protected api = this._utilService.serverlessAPI + '/api/loyalty-league'
  constructor(
    private _utilService: UtilService,
    private _apiService: ApiService,
    // private _toasterService:ToasterService
  ) {
    // if (!this._loyaltyLeagueLeaderBoard$.value) {
    //   firstValueFrom(this.getLoyaltyLeaderBoard()).then(lllb => this._loyaltyLeagueLeaderBoard$.next(lllb))
    //   firstValueFrom(this.getPrizePool()).then(llPrizePool => this._loyaltyLeaguePrizePool$.next(llPrizePool))
    // }
  }

  // private _formatErrors(error: any) {
  //   console.warn('my err', error)
  //   this._toasterService.msg.next({
  //     message: error.message || 'fail to load loyalty program',
  //     segmentClass: "toastError",
  //   });
  //   return throwError((() => error))
  // }
  public getSessionMetrics(): Observable<Season> {
    return of({
      airdrop: 10,
      season: 1,
      totalPoints: 1000,
      totalParticipants: 100,
      startDate: new Date(),
      endDate: new Date(),
    })
    // return this._loyaltyLeagueLeaderBoard$.value.totalPoints
  }
  // public getNextAirdrop(): Observable<NextAirdrop> {
  //   return this._apiService.get(`${this.api}/get-next-airdrop`).pipe(
  //     this._utilService.isNotNull,
  //     shareReplay(),
  //     // catchError((err) => this._formatErrors(err))
  //   )
  // }
  public getBoosters(): Observable<Multipliers> {
    return of({
      SOL: 1,
      hubSOL: 1,
      vSOL: 1,
      bSOL: 1,
      veMNDE: 1,
      veBLZE: 1,
      hubSOLDeFiBoost: 1,
      bonusPoints: {
        hubDomain: 500,
        referrals: 1.01,
        loyalBoost: {
          degen: 100,
          manlet: 1000,
          maxi: 10000,
          diamondHand: 100000,
        },
        ambassador: 100,
      },
    })
    // return this._apiService.get(`${this.api}/score`).pipe(
    //   shareReplay(),
    //   this._utilService.isNotNull,
    //   map((loyaltyBooster: LoyaltyBooster) => {

    //     return loyaltyBooster
    //   }),
    // catchError((err) => this._formatErrors(err))
    // )
  }
  public getLeaderBoard(): Observable<LeaderBoard> {
    return of(
      {
        totalPoints: 1000,
        loyaltyLeagueMembers: [
      {
        walletOwner: 'CdoFMmSgkhKGKwunc7TusgsMZjxML6kpsvEmqpVYPjyP',
          
        hubDomain: 'amir.hub',
        totalPts: 123,
        stakingPts: 3422,
        daoPts: 456,
        questsPts: 456,
        ambassadorPts: 0,
        referralPts: 100,
        referralCode: 'cds21',
        daysLoyal: 20,
      },
      {
        walletOwner: 'jqmFMmSgkhKGKwunc7TusgsMZjxML6kpsvEmqpVY1234',
        hubDomain: 'amir.hub',
        totalPts: 123,
        stakingPts: 3422,
        daoPts: 456,
        questsPts: 456,
        ambassadorPts: 0,
        referralPts: 100,
        referralCode: 'cds21',
        daysLoyal: 20,
      },
    ]})
    // return this._apiService.get(`${this.api}/leader-board`).pipe(
    //   this._utilService.isNotNull,
    //   map((loyaltyLeaderBoard: LoyaltyLeaderBoard) => {
    //     return loyaltyLeaderBoard
    //   }),
    //   shareReplay(),
    //   // catchError((err) => this._formatErrors(err))
    // )
  }
  // public getPrizePool(): Observable<PrizePool> {
  //   return this._apiService.get(`${this.api}/prize-pool`).pipe(
  //     this._utilService.isNotNull,
  //     map((prizePool: PrizePool) => {
  //       return prizePool
  //     }),
  //     shareReplay(),
  //     // catchError((err) => this._formatErrors(err))
  //   )
  // }

  public async addReferral(refCode: string, participantAddress: string) {
    let data = null
    try {
      const res = await fetch(`${this.api}/referral?refCode=${refCode}&referrerAddress=${participantAddress}`);
      data = await res.json();
    } catch (error) {
      console.warn(error);
    }
    return data
  }
}
