import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class PriceHistoryService {

  constructor(
    private _utilService: UtilService,
    private _apiService: ApiService
    ) { 
      this.getTokenDataByAddress("So11111111111111111111111111111111111111112").then(r => this.solPrice.set(r.market_data.current_price.usd))

    }


  protected _coingeckoAPI = 'https://api.coingecko.com/api/v3';
  public solPrice = signal(0);

  public async getTokenDataByAddress(mintAddress: string){
    let data = null
    try {
      const res = await fetch(`${this._coingeckoAPI}/coins/solana/contract/${mintAddress}`);
      data = await res.json();
    } catch (error) {
      console.warn(error);
    }
    return data
  }
  public async getCoinChartHistory(mintAddress: string, currency: string, days: number): Promise<any> {
    let {name,web_slug,  market_data } = await this.getTokenDataByAddress(mintAddress)
    name = name == 'Wrapped Solana' ? 'solana' : name
    let chartData = []
    try {
      const res = await fetch(`${this._coingeckoAPI}/coins/${web_slug.toLowerCase()}/market_chart?vs_currency=${currency}&days=${days}`);
      const data = await res.json();
      const dateList = data.prices.map((item) => this._utilService.datePipe.transform(item[0], 'MMM d'));
      const priceList = data.prices.map((item) => item[1]);
      chartData = [dateList, priceList];
    } catch (error) {
      console.warn(error);
    }
    return {chartData, market_data}

  }

}
