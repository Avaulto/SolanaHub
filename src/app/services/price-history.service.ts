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

    }


  protected _coingeckoAPI = `${this._utilService.serverlessAPI}/api/CG-proxy`;
  public async tokenPrice(id: string){
    let data = null
    try {
      const res = await fetch(`${this._coingeckoAPI}?endpoint=simple/price?ids=${id}`);
      data = await (await res.json())[id];
    } catch (error) {
      console.warn(error);
    }
    return data
  }
  public async getTokenDataByAddress(mintAddress: string){
    let data = null
    try {
      const res = await fetch(`${this._coingeckoAPI}?endpoint=coins/solana/contract/${mintAddress}`);
      data = await res.json();
    } catch (error) {
      console.warn(error);
    }
    return data
  }
  public async getCoinChartHistory(mintAddress: string, currency: string, days: number): Promise<any> {
    let {name,id,  market_data } = await this.getTokenDataByAddress(mintAddress)
    name = name == 'Wrapped Solana' ? 'solana' : name
    let chartData = []
    try {
      const queryParams = encodeURIComponent(`vs_currency=${currency}&days=${days}`)
      const res = await fetch(`${this._coingeckoAPI}?endpoint=coins/${id}/market_chart&queryParam=${queryParams}`);
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
