import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceHistoryService {

  constructor(
    private _apiService: ApiService
    ) { }
  // catch error
  // private _formatErrors(error: any) {
  //   console.warn(error)
  //   // this.toasterService.msg.next({
  //   //   message: error.error,
  //   //   icon: 'alert-circle-outline',
  //   //   segmentClass: "toastError",
  //   // });
  //   return throwError((() => error))
  // }

  protected _coingeckoAPI = 'https://api.coingecko.com/api/v3';


  public getCoinChartHistory(tokenName: string, currency: string, days: number): Observable<any> {
    return this._apiService.get(`${this._coingeckoAPI}/coins/${tokenName}/market_chart?vs_currency=${currency}&days=${days}`).pipe(
      map((chartData) => {
        // const dateList = data.prices.map((item) => new Date(item[0]).toLocaleString().split(',')[0]);
        // const priceList = data.prices.map((item) => item[1]);

        console.log(chartData);
        
        // return [dateList, priceList];
        return chartData
      }),
      // catchError((error) => this._formatErrors(error))
    );
  }

}
