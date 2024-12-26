export enum ModalType {
  VALIDATORS = 'validators-modal',
  DELEGATE_LST = 'delegate-lst-modal',
  UNSTAKE_LST = 'unstake-lst-modal',
  MERGE = 'merge-modal',
  SPLIT = 'split-modal',
  INSTANT_UNSTAKE = 'instant-unstake-modal',
  TRANSFER_AUTH = 'transfer-auth-modal',
  TOKEN_LIST = 'token-list',
  LIST_NFT = 'list-nft-modal',
  SEND_NFT = 'send-nft-modal',
}

export interface ModalConfig {
  logoURI?: string;
  title: string;
  desc: string;
  btnText: string;
} 