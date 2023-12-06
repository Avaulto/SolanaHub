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