import { Injectable, effect, signal } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import {  catchError, interval, map, Observable, of, shareReplay, startWith, Subject, switchMap, take, throwError } from 'rxjs';
import { loyaltyLeagueMember, Multipliers, Season, Tier } from '../models';
import { ToasterService } from './toaster.service';
import { SolanaHelpersService } from './solana-helpers.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyLeagueService {
  public hideLLv2 = signal(environment.production);
  protected api = this._utilService.serverlessAPI + '/api/loyalty-league-v2'
  constructor(
    private _utilService: UtilService,
    private _apiService: ApiService,
    private _toasterService:ToasterService,
    private _shs: SolanaHelpersService
  ) {
    // if (!this._loyaltyLeagueLeaderBoard$.value) {
    //   firstValueFrom(this.getLoyaltyLeaderBoard()).then(lllb => this._loyaltyLeagueLeaderBoard$.next(lllb))
    //   firstValueFrom(this.getPrizePool()).then(llPrizePool => this._loyaltyLeaguePrizePool$.next(llPrizePool))
    // }
  }
  // public member$ = new Subject<loyaltyLeagueMember>();
  public member$: Observable<loyaltyLeagueMember> = this._shs.walletExtended$.pipe(
    this._utilService.isNotNullOrUndefined,
    switchMap(wallet => {
      if (wallet) {
        return this.getMember(wallet.publicKey.toBase58()).pipe(
          map(member => {
            if (member) {
              return member;
            }
            return {} as loyaltyLeagueMember;
          })
        );
      } else {
        return of({} as loyaltyLeagueMember);
      }
    }),
    shareReplay()
  );
  
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
      points: 0,
      icon: 'assets/images/ll/badge-1.svg',
      iconFull: 'assets/images/ll/badge-full-1.svg',
      loyaltyDaysRequirement: 0,
    },
    {
      title: 'manlet',
      points: 1000,
      icon: 'assets/images/ll/badge-2.svg',
      iconFull: 'assets/images/ll/badge-full-2.svg',
      loyaltyDaysRequirement: 15,
    },
    {
      title: 'maxi',
      points: 2500,
      icon: 'assets/images/ll/badge-3.svg',
      iconFull: 'assets/images/ll/badge-full-3.svg',
      loyaltyDaysRequirement: 30,
    },
    {
      title: 'diamond-hands',
      points: 10000,
      icon: 'assets/images/ll/badge-4.svg',
      iconFull: 'assets/images/ll/badge-full-4.svg',
      loyaltyDaysRequirement: 60,
    },
  ];
  public getSessionMetrics(): Observable<Season> {
    // return this._loyaltyLeagueLeaderBoard$.value.totalPoints
    return this._apiService.get(`${this.api}/get-season-metrics`).pipe(
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
  public getLeaderBoard(): Observable<loyaltyLeagueMember[]> {

    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilService.isNotNull,
      catchError((err) => this._formatErrors(err))
    )
  }

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

  private _counterAnimation(startNumber: number, targetNumber: number, duration: number): Observable<number> {
    const totalNumbers = targetNumber - startNumber;
    const stepDuration = duration / totalNumbers;
  
    return interval(stepDuration).pipe(
      take(totalNumbers + 1),
      map(step => startNumber + step),
      startWith(startNumber)
    );
  }
}
