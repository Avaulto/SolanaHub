import { Component, Input, OnInit, signal } from '@angular/core';
import { IonInput, IonLabel, IonButton, IonText, IonCheckbox } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoyaltyBooster } from 'src/app/models';
import { map } from 'rxjs';
import { AsyncPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { TooltipModule } from 'src/app/shared/layouts/tooltip/tooltip.module';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
interface Boosters {
  nativeStake: number
  nativeStakeLongTermBoost: number
  hubSOL_DirectStakeBoost: number
  referral_Boost: number
  hubDomain_Boost: number
  mSOL_DirectStakeBoost: number
  vSOL_DirectStakeBoost: number
  bSOL_DirectStakeBoost: number
  veMNDE_Boost: number
  veBLZE_Boost: number
}

interface apyRates {
  SOL: number
  vSOL: number
  MNDE: number
  mSOL: number
  BLZE: number
  bSOL: number
  hubSOL: number
}
@Component({
  selector: 'app-boost-calc',
  templateUrl: './boost-calc.component.html',
  styleUrls: ['./boost-calc.component.scss'],
  standalone: true,
  imports: [TooltipModule, IonCheckbox,DecimalPipe, PercentPipe, IonInput, IonLabel, IonText, ReactiveFormsModule, AsyncPipe]
})
export class BoostCalcComponent implements OnInit {
  @Input() multipliers: Boosters;
  @Input() apyRates: apyRates;
  @Input() rebates: number;
  public boostForm: FormGroup;
  public boostSum = null;
  public esWeeklyReward = 0
  constructor(
    private _fb: FormBuilder,
    private _lls:LoyaltyLeagueService
  ) { }

  ngOnInit() {
    const factors = {
      "SOL": this.multipliers.nativeStake,
      "MNDE": this.multipliers.veMNDE_Boost,
      "vSOL": this.multipliers.vSOL_DirectStakeBoost,
      "BLZE": this.multipliers.veBLZE_Boost,
      "bSOL": this.multipliers.bSOL_DirectStakeBoost,
      "hubSOL": this.multipliers.hubSOL_DirectStakeBoost
    };

    // APYs for each input
    const apys = {
      "SOL": this.apyRates.SOL,
      "hubSOL": this.apyRates.hubSOL,
      "vSOL": this.apyRates.vSOL,
      "bSOL": this.apyRates.bSOL,
      "MNDE": this.apyRates.MNDE,
      "BLZE": this.apyRates.BLZE
    };

    this.boostForm = this._fb.group({
      native: [],
      hubSOL: [],
      bSOL: [],
      vSOL: [],
      veMNDE: [],
      veBLZE: [],
      hubDomain: [false]
    })
    this.boostSum = this.boostForm.valueChanges.pipe(map(v => {
      // Calculate true values
      // Example input amounts
      const inputs = {
        "SOL": v.native,
        "MNDE": v.veMNDE,
        "vSOL": v.vSOL,
        "BLZE": v.veBLZE,
        "bSOL": v.bSOL,
        "hubSOL": v.hubSOL
      };
      // Calculate true values
      const trueValues = this.calculateTrueValues(inputs, factors);
      this.esWeeklyReward = this.calculateTotalAPYhubSOL(trueValues)
      
      // const totalPts = Object.values(trueValues).reduce((acc, v) => Number(acc) + Number(v),0)
      
      
      // Calculate total APY
      let totalAPY = this.calculateTotalAPY(trueValues, apys);
      
      // percentage boost by hubDOMAIN
      v.hubDomain ? this.esWeeklyReward = this.esWeeklyReward * 1.05 : this.esWeeklyReward
      v.hubDomain ? totalAPY = totalAPY * 1.05 : totalAPY

      
      return totalAPY

    }))
  }

  // Function to calculate the true value adjusted by the factor
  calculateTrueValues(inputs, factors) {

    const trueValues = {};
    for (let key in inputs) {
      if (inputs.hasOwnProperty(key) && factors.hasOwnProperty(key)) {
        trueValues[key] = inputs[key] * factors[key];
      }
    }


    return trueValues;
  }

  calculateTotalAPYhubSOL(trueValues){
    const calculatedPts:any = Object.values(trueValues).reduce((acc: number, v) => Number(acc || 0) + Number(v),0);
    const newTotalPts = this._lls.getllTotalPts() + calculatedPts;
    const estimatedAirdrop = calculatedPts / newTotalPts * this.rebates
    return estimatedAirdrop
  }
  // Function to calculate the total APY
  calculateTotalAPY(trueValues, apys) {
    let totalTrueValue = 0;
    let weightedAPY = 0;
    
    for (let key in trueValues) {
      if (trueValues.hasOwnProperty(key) && apys.hasOwnProperty(key)) {
        totalTrueValue += trueValues[key];
        weightedAPY += trueValues[key] * apys[key];
      }
    }
    return weightedAPY / totalTrueValue;
  }



}
