import { AccountAddress } from "@dialectlabs/sdk";

export interface DappMessageExtended {
  text: string;
  name: string;
  type: string;
  imgURL: string;
  timestamp: Date;
  author: AccountAddress;
  icon?: string;
  message?: string;
  metadata?: {
    title?:string;
  }
}