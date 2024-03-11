// RPC or explorer interface
export interface Config {
    name: string,
    imageURL: string,
    value: string | number,
}
export enum PriorityFee {
    None = 100,
    Fast = 1000,
    Supercharger = 100000,
  }