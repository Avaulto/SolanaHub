import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PortfolioService } from 'src/app/services';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
import { UtilService } from 'src/app/services/util.service';

@Injectable({
  providedIn: 'root'
})
export class AgentActionsService {

  constructor(
    private _utils: UtilService,
    private _portfolioService: PortfolioService,
    private _loyaltyLeagueService: LoyaltyLeagueService
  ) { }
  public async askAgent(prompt: string) {
    // get user context
    const userPortfolio =  this._portfolioService.walletAssets()
    const loyaltyLeagueMember = this._loyaltyLeagueService._member
    const userContext = {
      portfolio: userPortfolio,
      loyaltyLeagueMember: loyaltyLeagueMember
    }
    console.log(userContext)
    try {
      const response = await fetch(`${this._utils.serverlessAPI}/api/hubbie-agent/ask`, {
        method: 'POST',
        body: JSON.stringify({ prompt, context:userContext })
      });
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
