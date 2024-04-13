import {getBaseConfig} from "./base-config";
import {EnvironmentConfig} from "../app/models";
import {EnvironmentName} from "../app/enums";

export const environment: EnvironmentConfig = {
  name: EnvironmentName.Local,
  production: false,
  solanaEnv: 'mainnet-beta',
  solanaCluster: 'https://evocative-aged-wish.solana-mainnet.quiknode.pro',
  apiUrl: "http://localhost:3000",
  platformFeeCollector:'81QNHLve6e9N2fYNoLUnf6tfHWV8Uq4qWZkkuZ8sAfU1',
  platformATAbSOLFeeCollector:'BKSiuLdsNrj6oqQCgSSVXhfraK4WdrC8t7mnYWcMcM13',
  turnStile: '0x4AAAAAAAWLe07W81onsc2Q',
  ...getBaseConfig()
};
