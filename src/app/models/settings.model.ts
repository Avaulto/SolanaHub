// RPC or explorer interface

export interface Config {
  name: string,
  imageURL: string,
  value: string | number,
}

export enum PriorityFee {
  None = 70000,
  Fast = 300000,
  Supercharger = 700000,
}

export interface BaseConfig {
  platformFeeCollector: string;
  rpcs: Config[],
  explorers: Config[],
  PriorityFee: Config[],
  Theme: Config[],
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
  readonly Theme: Config[];
}
