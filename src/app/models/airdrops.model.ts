export interface Airdrops {
    error: any
    data: Array<{
      address: string
      eligibility: Array<{
        protocol: string
        protocolLabel: string
        token: string
        ticker: string
        eligible: boolean
        amount: number
        note: string
        potentialValueUsdc: number
        stage: string
        tokenPrice: number
      }>
      points: Array<{
        protocol: string
        protocolLabel: string
        note: string
        points: number
        stage: string
      }>
      network: string
      timeTaken: Array<{
        action: string
        time: number
      }>
      error: any
      alias: any
    }>
  }
  