// RPC or explorer interface
export interface Config {
    name: string,
    imageURL: string,
    value: string | number,
}
export enum PriorityFee {
    None = 5000,
    Fast = 1000000,
    Supercharger = 10000000,
  }