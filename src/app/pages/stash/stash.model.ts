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
    name: string,
    symbol: string,
    imgUrl: string | string[],
    platformImgUrl: string,
    tokens?: { address: string, decimals: number, symbol: string, imgUrl: string }[],
    balance?: number,
    account: { addr: string, addrShort: string },
    platform?: string,
    poolPair?: string,
    source: string,
    extractedValue: any// { [key: string]: number },
    value?: number,
    action: string,
    type: string,
    positionData?: any
  }

  export interface OutOfRange {
    positionData: any
    poolPair: string
    poolTokenA: {
      address: string,
      decimals: number,
      symbol: string,
      imgUrl: string,
    },
    poolTokenB: {
      address: string,
      decimals: number,
      symbol: string,
      imgUrl: string,
    },
    isOutOfRange: boolean,
    platform: string,
    platformImgUrl: string,
    pooledAmountAWithRewards: string,
    pooledAmountBWithRewards: string,
    pooledAmountAWithRewardsUSDValue: number,
    pooledAmountBWithRewardsUSDValue: number
  }