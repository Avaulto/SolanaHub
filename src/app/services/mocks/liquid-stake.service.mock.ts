import {DirectStake, StakePool} from "../../models";
import {LiquidStakeService} from "../liquid-stake.service";

class LiquidStakeServiceMock {

  getStakePoolList(): Promise<StakePool[]> {
    return Promise.resolve({} as StakePool[]);
  }

  stake(...args): Promise<string> {
    return Promise.resolve("");
  }

  stakePoolStakeAccount(...args) {

  }

  stakeCLS(...args): Promise<string> {
    return Promise.resolve("");
  }

  depositStakeHubSolPool(...args): Promise<void> {
    return Promise.resolve();
  }

  unstake(...args): Promise<void> {
    return Promise.resolve();
  }

  depositSolHubSolPool(...args): Promise<void> {
    return Promise.resolve();
  }

  getDirectStake(...args): Promise<DirectStake> {
    return Promise.resolve({} as DirectStake);
  }

  updateSolBlazePool(): Promise<void> {
    return Promise.resolve();
  }
}

export const LiquidStakeServiceMockProvider = {
  provide: LiquidStakeService,
  useClass: LiquidStakeServiceMock
}
