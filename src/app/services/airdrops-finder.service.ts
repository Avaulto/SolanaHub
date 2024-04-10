import { Injectable } from '@angular/core';
import { Airdrops } from '../models';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AirdropsFinderService {

  constructor(private _utils: UtilService) { }
  private restAPI = this._utils.serverlessAPI
  public async getWalletAirdrops(walletOwner: string):Promise<Airdrops>{

    let airdrops: Airdrops = null;
    try {
      // while (!this._utils.turnStileToken) await this._utils.sleep(500);
      const result = await (await fetch(`${this.restAPI}/api/portfolio/airdrops?address=${walletOwner}`)).json()
      airdrops = result;
    }
    catch (error) {
      console.error(error);
    }
    return airdrops
  
}
}
