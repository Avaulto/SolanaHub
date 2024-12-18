export interface NftTable {
  collectionName: string
  floor: number
  imageUri: string
  listed: number
  nfts: Array<{
    listed?: boolean
    imageUri: string
  }>
  value: number
}
