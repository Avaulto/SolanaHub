import { EnvironmentConfig } from "../app/models";
import { EnvironmentName } from "../app/enums";
import { getBaseConfig } from "./base-config";

export const environment: EnvironmentConfig = {
  name: EnvironmentName.Development,
  production: false,
  solanaEnv: 'mainnet-beta',
  solanaCluster: 'https://carole-l8ne8x-fast-mainnet.helius-rpc.com',
  apiUrl: "https://api.SolanaHub.app",
  platformFeeCollector:'81QNHLve6e9N2fYNoLUnf6tfHWV8Uq4qWZkkuZ8sAfU1',
  platformATAbSOLFeeCollector:'BKSiuLdsNrj6oqQCgSSVXhfraK4WdrC8t7mnYWcMcM13',
  turnStile: '0x4AAAAAAAVqd3Q0Le6TMHMl',
  ...getBaseConfig()
};
