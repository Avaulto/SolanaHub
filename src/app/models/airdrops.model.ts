export interface Airdrops {
  date: number
  owner: string
  addressSystem: string
  fetcherReports: Array<{
    id: string
    status: string
    duration: number
  }>
  airdrops: Array<{
    id: string
    claimLink: string
    image: string
    emitterLink: string
    emitterName: string
    claimStart: number
    claimEnd?: number
    name?: string
    items: Array<{
      amount: number
      isClaimed?: boolean
      isEligible: boolean
      label: string
      address: string
      airdropId: string
      price: number
      status: string
      value: number
      owner: string
    }>
    owner: string
    networkId: string
    status: string
    value: number
  }>
  duration: number
}
  