import { AccountAddress } from "@dialectlabs/sdk";

export interface DappMessageExtended {
  text: string;
  name: string;
  type: string;
  imgURL: string;
  timestamp: Date;
  author: AccountAddress;
  icon?: string;
  title?:string;
  message?: string;
}