import { BaseConfig } from "../app/models";

export const getBaseConfig = (): BaseConfig => {
  return {
    rpcs: [
      // {
      //   name: "QuickNode",
      //   imageURL: "../assets/images/quicknode-icon.png",
      //   value: "https://evocative-aged-wish.solana-mainnet.discover.quiknode.pro"
      // },
      {
        name: 'Helius',
        imageURL: '../assets/images/helius-icon.png',
        value: 'https://carole-l8ne8x-fast-mainnet.helius-rpc.com'
      },
      
      {
        name: 'Triton',
        imageURL: '../assets/images/triton-icon.svg',
        value: 'https://mb-avaulto-cc28.mainnet.rpcpool.com/190dce2e-b99d-475e-8e0f-3207a5c97e8b'
      },
      {
        name: 'Custom RPC',
        imageURL: '../assets/images/cog-icon.svg',
        value: ''
      }
    ],
    explorers: [
      {
        name: 'Solscan',
        imageURL: '../assets/images/solscan-icon.svg',
        value: 'https://solscan.io'
      },
      {
        name: 'Solana FM',
        imageURL: '../assets/images/solanafm-icon.svg',
        value: 'https://solana.fm'
      },
      {
        name: 'SOL explorer',
        imageURL: '../assets/images/base-explorer-icon.svg',
        value: 'https://explorer.solana.com'
      }
    ],

    Theme: [
      {
        name: 'Light',
        imageURL: '../assets/images/sun-icon.svg',
        value: 'light'
      },
      {
        name: 'Dark',
        imageURL: '../assets/images/moon-icon.svg',
        value: 'dark'
      }
    ]
  }
  
}
