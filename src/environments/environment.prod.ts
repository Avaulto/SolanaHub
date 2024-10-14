import {getBaseConfig} from "./base-config";
import {EnvironmentConfig} from "../app/models";
import {EnvironmentName} from "../app/enums";

export const environment: EnvironmentConfig = {
  name: EnvironmentName.Production,
  production: true,
  solanaEnv: 'mainnet-beta',
  solanaCluster: 'https://carole-l8ne8x-fast-mainnet.helius-rpc.com',
  apiUrl: "https://api.SolanaHub.app",
  platformATAbSOLFeeCollector:'BKSiuLdsNrj6oqQCgSSVXhfraK4WdrC8t7mnYWcMcM13',
  turnStile: '0x4AAAAAAAVqd3Q0Le6TMHMl',
  ...getBaseConfig()
};
