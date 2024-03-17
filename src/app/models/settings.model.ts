// RPC or explorer interface
export interface Config {
    name: string,
    imageURL: string,
    value: string | number,
}
export enum PriorityFee {
    None = 10000,
    Fast = 75000,
    Supercharger = 300000,
  }