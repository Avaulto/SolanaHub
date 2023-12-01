import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { FetchersResult, PortfolioElementMultiple, mergePortfolioElementMultiples } from '@sonarwatch/portfolio-core';
import { Token } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // todo - refactor to signal
  constructor(private _utilService: UtilService) { }

  public async getPortfolioAssets() {


    try {
      const jupTokens = await this._utilService.getJupTokens()
      const portfolio = await (await fetch('https://api.solanahub.app/api/portfolio?address=CdoFMmSgkhKGKwunc7TusgsMZjxML6kpsvEmqpVYPjyP')).json()
      const editedData: PortfolioElementMultiple[] = mergePortfolioElementMultiples(portfolio.elements);
      const extendTokenData: any = editedData.find(group => group.platformId === 'wallet-tokens')
      if (extendTokenData) {
        this._utilService.addTokenData(extendTokenData?.data.assets, jupTokens)
      }
      // add pipes
      const assetAggregated: Token[] = extendTokenData.data.assets.map((item: Token) =>{
        item.amount = this._utilService.decimalPipe.transform(item.amount)  +' ' + item.symbol || '0' +' '+ item.symbol
        item.price = this._utilService.currencyPipe.transform(item.price) || '0'
        item.value = this._utilService.currencyPipe.transform(item.value) || '0'
      })
      return extendTokenData.data.assets
    } catch (error) {

    }
  }


}
