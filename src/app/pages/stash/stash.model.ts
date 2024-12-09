export interface AssetBase {
  name: string;
  symbol: string;
  logoURI: string | string[];
  address: string;
  value?: number;
}

export interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
  logoURI: string;
}
export interface StashGroup {
    // networkId: string
    // platformId: string
    // type: string
    label: string
    description: string
    actionTitle: string
    value: number
    data: {
      assets: StashAsset[]
    }
  }
  export interface StashAsset {
    id: number,
    name: string,
    symbol: string,
    logoURI: string | string[],
    platformLogoURI?: string,
    tokens?: { address: string, decimals: number, symbol: string, logoURI: string }[],
    balance?: number,
    mint?: string,
    decimals?: number,
    account: { addr: string, addrShort: string },
    platform?: string,
    poolPair?: string,
    source: string,
    extractedValue: any// { [key: string]: number },
    value?: number,
    action: string,
    type: string,
    positionData?: any
    checked: boolean
  }

  export interface OutOfRange {
    type: 'outOfRange' | 'noLiquidity',
    accountRentFee?: number,
    address: string
    positionData: any
    poolPair: string
    poolTokenA: {
      address: string,
      decimals: number,
      symbol: string,
      logoURI: string,
    },
    poolTokenB: {
      address: string,
      decimals: number,
      symbol: string,
      logoURI: string,
    },
    isOutOfRange: boolean,
    platform: string,
    platformLogoURI: string,
    pooledAmountAWithRewards: string,
    pooledAmountBWithRewards: string,
    pooledAmountAWithRewardsUSDValue: number,
    pooledAmountBWithRewardsUSDValue: number
  }