import {getBaseConfig} from "./base-config";
import {EnvironmentConfig} from "../app/models";
import {EnvironmentName} from "../app/enums";

export const environment: EnvironmentConfig = {
  name: EnvironmentName.Production,
  production: true,
  solanaEnv: 'mainnet-beta',
  solanaCluster: 'https://carole-l8ne8x-fast-mainnet.helius-rpc.com',
  apiUrl: "https://api.SolanaHub.app",
  platformFeeCollector:'HUBpmKPsZaXWCDoWh1SScYMneVSQJve99NamntdsEovP',
  turnStile: '0x4AAAAAAAVqd3Q0Le6TMHMl',
  ...getBaseConfig()
};
