import { EnvironmentConfig } from "../app/models";
import { EnvironmentName } from "../app/enums";
import { getBaseConfig } from "./base-config";

export const environment: EnvironmentConfig = {
  name: EnvironmentName.Development,
  production: false,
  solanaEnv: 'mainnet-beta',
  solanaCluster: 'https://carole-l8ne8x-fast-mainnet.helius-rpc.com',
  apiUrl: "https://dev-api.SolanaHub.app",
  platformFeeCollector:'HUBpmKPsZaXWCDoWh1SScYMneVSQJve99NamntdsEovP',
  turnStile: '1x00000000000000000000BB',
  ...getBaseConfig()
};
