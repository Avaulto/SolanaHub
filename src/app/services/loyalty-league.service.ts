import { Injectable, effect, signal } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import {  catchError, map, Observable, of, throwError } from 'rxjs';
import { LeaderBoard, loyaltyLeagueMember, Multipliers, Season, Tier } from '../models';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyLeagueService {
  // private _loyaltyLeagueLeaderBoard$ = new BehaviorSubject(null as LoyaltyLeaderBoard);
  // public llb$ = this._loyaltyLeagueLeaderBoard$.asObservable().pipe(this._utilService.isNotNullOrUndefined)

  // private _loyaltyLeaguePrizePool$ = new BehaviorSubject(null as PrizePool);
  // public llPrizePool$ = this._loyaltyLeaguePrizePool$.asObservable().pipe(this._utilService.isNotNullOrUndefined)

  protected api = this._utilService.serverlessAPI + '/api/loyalty-league-v2'
  constructor(
    private _utilService: UtilService,
    private _apiService: ApiService,
    private _toasterService:ToasterService
  ) {
    // if (!this._loyaltyLeagueLeaderBoard$.value) {
    //   firstValueFrom(this.getLoyaltyLeaderBoard()).then(lllb => this._loyaltyLeagueLeaderBoard$.next(lllb))
    //   firstValueFrom(this.getPrizePool()).then(llPrizePool => this._loyaltyLeaguePrizePool$.next(llPrizePool))
    // }
  }

  private _formatErrors(error: any) {
    console.warn('my err', error)
    this._toasterService.msg.next({
      message: error.message || 'fail to load loyalty league data',
      segmentClass: "toastError",
    });
    return throwError((() => error))
  }
  public tiers: Tier[] = [
    {
      title: 'degen',
      points: 1000,
      icon: 'assets/images/ll/badge-1.svg',
      iconFull: 'assets/images/ll/badge-full-1.svg',
      loyaltyDaysRequirement: 15,
    },
    {
      title: 'manlet',
      points: 1000,
      icon: 'assets/images/ll/badge-2.svg',
      iconFull: 'assets/images/ll/badge-full-2.svg',
      loyaltyDaysRequirement: 30,
    },
    {
      title: 'maxi',
      points: 1000,
      icon: 'assets/images/ll/badge-3.svg',
      iconFull: 'assets/images/ll/badge-full-3.svg',
      loyaltyDaysRequirement: 45,
    },
    {
      title: 'diamond-hands',
      points: 1000,
      icon: 'assets/images/ll/badge-4.svg',
      iconFull: 'assets/images/ll/badge-full-4.svg',
      loyaltyDaysRequirement: 60,
    },
  ];
  public getSessionMetrics(): Observable<Season> {
    // return this._loyaltyLeagueLeaderBoard$.value.totalPoints
    return this._apiService.get(`${this.api}/session-metrics`).pipe(
      this._utilService.isNotNull,
      catchError(err => this._formatErrors(err))
    )
  }
  private _llMember: loyaltyLeagueMember = null
  public getMember(walletAddress: string): Observable<loyaltyLeagueMember> {
    if (this._llMember) {
      return of(this._llMember)
    }
    return this._apiService.get(`${this.api}/get-loyalty-league-member?walletAddress=${walletAddress}`).pipe(
      this._utilService.isNotNull,
      catchError(err => this._formatErrors(err))
    )
  }
  // public getNextAirdrop(): Observable<NextAirdrop> {
  //   return this._apiService.get(`${this.api}/get-next-airdrop`).pipe(
  //     this._utilService.isNotNull,
  //     shareReplay(),
  //     // catchError((err) => this._formatErrors(err))
  //   )
  // }
  public multipliers: Multipliers = null
  public async getBoosters(): Promise<Multipliers> {
    if (this.multipliers) {
      return this.multipliers
    }
    try {
      const res = await(await fetch(`${this.api}/multipliers`)).json()
      this.multipliers = res
      return res
    } catch (error) {
      this._formatErrors(error)
      return null
    }
   
  }
  public getLeaderBoard(): Observable<LeaderBoard> {

    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilService.isNotNull,
      catchError((err) => this._formatErrors(err))
    )
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
