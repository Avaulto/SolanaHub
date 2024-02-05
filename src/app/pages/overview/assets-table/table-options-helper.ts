// export const tokenTpl = `<ng-template #tokenTpl let-row let-rowIndex="rowIndex" let-column="column">
// <div class="asset">

//   <div class="asset-img-wrapper">
//     <ion-img [src]="row.imgUrl" alt="image" />
//   </div>
//   <div class="asset-info">
//     <div class="asset-symbol">{{row.symbol}}</div>
//     <div class="asset-name">{{row.name}}</div>
//   </div>

// </div>
// </ng-template>`
// export const columnsOptions = {
//     tokens: [
//         { key: 'token', title: 'Token', cellTemplate: tokenTpl, width: '45%' },
//         { key: 'amount', title: 'Amount', width: '10%', cssClass: { name: 'light-text', includeHeader: false } },
//         { key: 'price', title: 'Price', width: '10%', cssClass: { name: 'light-text', includeHeader: false } },
//         { key: 'value', title: 'Value', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
//         { key: 'last-seven-days', title: 'Last 7 Days', width: '15%' }
//       ],
//     nfts:[
//         { key: 'collection', title: 'Collection', cellTemplate: 'tokenTpl', width: '25%' },
//         { key: 'nft', title: 'NFT', width: '30%', cssClass: { name: 'light-text', includeHeader: false } },
//         { key: 'floor', title: 'Floor(SOL)', width: '10%', cssClass: { name: 'light-text', includeHeader: false } },
//         { key: 'listed', title: 'Listed', width: '10%', cssClass: { name: 'bold-text', includeHeader: false } },
//         { key: 'total-value', title: 'Total Value', width: '15%' }
//       ]
// }


export const tokenDummyPlaceholder = [
    {
        "type": "",
        "networkId": "",
        "value": "",
        "attributes": {},
        "name": "",
        "symbol": "",
        "imgUrl": "",
        "decimals": "",
        "address": "",
        "amount": "",
        "price": ""
    },
    {
        "type": "",
        "networkId": "",
        "value": "",
        "attributes": {},
        "name": "",
        "symbol": "",
        "imgUrl": "",
        "decimals": "",
        "address": "",
        "amount": "",
        "price": ""
    },

]

export const nftDummyPlaceholder = [
    {
        collectionName: 'mad lads',
        floor: 142,
        listed: 1,
        offers: 24,
        nfts: [
            {
                imgUrl: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            }, {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
            {
                imgURL: '',
            },
        ],
        totalValue: 110332
    },
    {
        collection: 'mad lads',
        floor: 142,
        listed: 1,
        offers: 24,
        nfts: [{
            imgURL: '',
        }],
        totalValue: 110332
    },
    {
        collection: 'famous fox federation',
        floor: 57,
        listed: 7,
        offers: 14,
        nfts: [{
            imgURL: '',
        },
        {
            imgURL: '',
        },
        {
            imgURL: '',
        }
        ],
        totalValue: 43514
    }
]

export const defiDummyPlaceholder = [
    {
        poolTokens: [
            {
                imgURL: 'assets/images/usdc.svg',
                symbol: 'USDC'
            },
            {
                imgURL: 'assets/images/sol.svg',
                symbol: 'SOL'
            },
        ],
        imgURL:'https://assets.coingecko.com/coins/images/17547/large/Orca_Logo.png?1696517083',
        platform: 'orca',
        type: 'farm',
        holdings: [{symbol: 'USDC', balance: 123 }, {symbol: 'SOL', balance: 567 }],
        value: 32434,
        link: 'www.meteora.ag',
        supported: false,
    },
    {
        poolTokens: [

            {
                imgURL: 'assets/images/sol.svg',
                symbol: 'SOL'
            },
        ],
        imgURL:'https://assets.coingecko.com/coins/images/17547/large/Orca_Logo.png?1696517083',
        pool: 'meteora',
        type: 'farm',
        holdings: [ {symbol: 'SOL', balance: 567 }],
        value: 32434,
        link: 'www.marginfi.com',
        supported: false,
    },
    {
        poolTokens: [
            {
                imgURL: 'assets/images/usdc.svg',
                symbol: 'USDC'
            },
            {
                imgURL: 'assets/images/usdc.svg',
                symbol: 'USDC'
            },
            {
                imgURL: 'assets/images/sol.svg',
                symbol: 'SOL'
            },
        ],
        imgURL:'https://styles.redditmedia.com/t5_6qrg6t/styles/communityIcon_92h259miw7l91.png',
        dex: 'kamino',
        type: 'providing liquidity',
        holdings: [{symbol: 'USDC', balance: 123 }, {symbol: 'SOL', balance: 567 }, {symbol: 'SOL', balance: 567 }],
        value: 32434,
        link: 'www.marginfi.com',
        supported: false,
    },
]

export const stakingDummyPlaceholder = [
    {
        name: 'SolanaHub',
        imgUrl: 'assets/images/solanahub-logo.png',
        apy: 7+'%',
        balance: { sol: 1545, usd: 3452 },
        accumulatedRewards: 1+ ' SOL',
        status: 'active',
        link: 'https://solscan.io/address/7p47fDAPGkXj3xct9mR38oNtxXf1g6pkbid35yZf6izC'
    },
    {
        name: 'Solana Compass',
        imgUrl: 'assets/images/solana-compass.webp',
        apy: 7.5+'%',
        balance: { sol: 234, usd: 65756 },
        accumulatedRewards: 56+ ' SOL',
        status: 'activated',
        link: 'https://solscan.io/address/7p47fDAPGkXj3xct9mR38oNtxXf1g6pkbid35yZf6izC'
    },
    {
        name: 'Solana Compass',
        imgUrl: 'assets/images/solana-compass.webp',
        apy: 7.5+'%',
        balance: { sol: 3256, usd: 5675834 },
        accumulatedRewards: 234 + ' SOL',
        status: 'deactive',
        link: 'https://solscan.io/address/7p47fDAPGkXj3xct9mR38oNtxXf1g6pkbid35yZf6izC'
    },
    {
        name: 'SolanaHub',
        imgUrl: 'assets/images/solanahub-logo.png',
        apy: 7+'%',
        balance: { sol: 1545, usd: 3452 },
        accumulatedRewards: 1+ ' SOL',
        status: 'active',
        link: 'https://solscan.io/address/7p47fDAPGkXj3xct9mR38oNtxXf1g6pkbid35yZf6izC'
    },
    {
        name: 'Solana Compass',
        imgUrl: 'assets/images/solana-compass.webp',
        apy: 7.5+'%',
        balance: { sol: 8799, usd: 3456346 },
        accumulatedRewards: 56+ ' SOL',
        status: 'deactivated',
        link: 'https://solscan.io/address/7p47fDAPGkXj3xct9mR38oNtxXf1g6pkbid35yZf6izC'
    },
]
