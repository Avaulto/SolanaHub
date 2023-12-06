export interface Token{
    type: string,
    networkId: string,
    value: string,
    name: string,
    symbol: string,
    imgUrl: string,
    decimals: number,
    address: string,
    amount: string,
    price: string
}
export interface NFT{
    collectionName: string,
    collectionImgUrl:string,
    imgUrl: string,
    name: string,
    floorPrice: string,
    listed: boolean,
    value: string
}
export interface LiquidityProviding{
    token: Token[]
    platform: string,
    apy: string
}
export interface LendingOrBorrow{
    token: Token[]
    platform: string,
    apy: string
}

export interface StakeAccount {

}