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

export interface BaseConfig {
  rpcs: Config[],
  explorers: Config[],
  PriorityFee: Config[],
}

export interface EnvironmentConfig {
  readonly name: string;
  readonly turnStile: string;
  readonly production: boolean;
  readonly solanaEnv: string;
  readonly solanaCluster: string;
  readonly apiUrl: string;
  readonly platformFeeCollector: string;
  readonly platformATAbSOLFeeCollector: string;
  readonly rpcs: Config[];
  readonly explorers: Config[];
  readonly PriorityFee: Config[];
}
