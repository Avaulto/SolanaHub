import { Injectable } from '@angular/core';

import {
  DustValueTokensService,
  StakeOverflowService,
  OutOfRangeDeFiPositionsService,
  ZeroValueAssetsService,
  EarningsService
} from './helpers';


@Injectable({
  providedIn: 'root'
})
export class StashService {
  constructor(
    private _dustValueTokensService: DustValueTokensService,
    private _stakeOverflowService: StakeOverflowService,
    private _outOfRangeDeFiPositionsService: OutOfRangeDeFiPositionsService,
    private _zeroValueAssetsService: ZeroValueAssetsService,
    private _earningsService: EarningsService
  ) {

  }



  // stakeoverflow fn:
  public findStakeOverflow = this._stakeOverflowService.findStakeOverflow.bind(this._stakeOverflowService)
  public withdrawStakeAccountExcessBalance = this._stakeOverflowService.withdrawStakeAccountExcessBalance.bind(this._stakeOverflowService)

  // dust value fn:
  public findDustValueTokens = this._dustValueTokensService.dustValueTokens.bind(this._dustValueTokensService)
  public updateDustValueTokens = this._dustValueTokensService.updateDustValueTokensWithShare.bind(this._dustValueTokensService)
  public swapDustValueTokens = this._dustValueTokensService.bulkSwapDustValueTokens.bind(this._dustValueTokensService)

  // out of range defi fn:
  public findOutOfRangeDeFiPositions = this._outOfRangeDeFiPositionsService.findOutOfRangeDeFiPositions
  public closeOutOfRangeDeFiPosition = this._outOfRangeDeFiPositionsService.closeOutOfRangeDeFiPosition.bind(this._outOfRangeDeFiPositionsService)
  public updateOutOfRangeDeFiPositions = this._outOfRangeDeFiPositionsService.updateOutOfRangeDeFiPositions.bind(this._outOfRangeDeFiPositionsService)

  // zero value assets fn:
  public findZeroValueAssets = this._zeroValueAssetsService.findZeroValueAssets.bind(this._zeroValueAssetsService)
  public updateZeroValueAssets = this._zeroValueAssetsService.updateZeroValueAssets.bind(this._zeroValueAssetsService)
  public getZeroValueAssetsByBalance = this._zeroValueAssetsService.getZeroValueAssetsByBalance.bind(this._zeroValueAssetsService)
  public burnZeroValueAssets = this._zeroValueAssetsService.burnAccounts.bind(this._zeroValueAssetsService)


  // earnings fn:
  public getOrCreateUser = this._earningsService.getOrCreateUser.bind(this._earningsService)
  public storeRecord = this._earningsService.storeRecord.bind(this._earningsService)
  public updatePlatformRecord = this._earningsService.updatePlatformRecord.bind(this._earningsService)
  public stashUser = this._earningsService.stashUser.bind(this._earningsService)
  public referralAddress = this._earningsService.referralAddress.bind(this._earningsService)
}
