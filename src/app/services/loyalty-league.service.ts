import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { Observable, map, shareReplay } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyScore, NextAirdrop, PrizePool } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyLeagueService {

  protected api = this._utilService.serverlessAPI + '/api/loyalty-points'
  constructor(
    private _utilService: UtilService,
    private _apiService: ApiService,
    // private _toasterService:ToasterService
  ) { }

  // private _formatErrors(error: any) {
  //   console.warn('my err', error)
  //   this._toasterService.msg.next({
  //     message: error.message || 'fail to load loyalty program',
  //     segmentClass: "toastError",
  //   });
  //   return throwError((() => error))
  // }
  public getNextAirdrop(): Observable<NextAirdrop> {
    return this._apiService.get(`${this.api}/get-next-airdrop`).pipe(
      this._utilService.isNotNull,
      map((nextAirdrop: NextAirdrop) => {
        return nextAirdrop
      }),
      shareReplay(),
      // catchError((err) => this._formatErrors(err))
    )
  }
  public getLoyaltyScore(): Observable<LoyaltyScore> {
    return this._apiService.get(`${this.api}/score`).pipe(
      shareReplay(),
      this._utilService.isNotNull,
      map((loyaltyScore: LoyaltyScore) => {
        return loyaltyScore
      }),
      // catchError((err) => this._formatErrors(err))
    )
  }
  public getLoyaltyLeaderBoard(): Observable<LoyaltyLeaderBoard> {
    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilService.isNotNull,
      map((loyaltyLeaderBoard: LoyaltyLeaderBoard) => {
        return loyaltyLeaderBoard
      }),
      shareReplay(),
      // catchError((err) => this._formatErrors(err))
    )
  }
  public getPrizePool(): Observable<PrizePool> {
    return this._apiService.get(`${this.api}/prize-pool`).pipe(
      this._utilService.isNotNull,
      map((prizePool: PrizePool) => {
        return prizePool
      }),
      shareReplay(),
      // catchError((err) => this._formatErrors(err))
    )
  }
  public addReferral(referer:string, participantAddress: string) {
    return this._apiService.get(`${this.api}/referral?referAddress=${referer}&participantAddress=${participantAddress}`).pipe(
      this._utilService.isNotNull,
      shareReplay(),
      // catchError((err) => this._formatErrors(err))
    )
  }
}
