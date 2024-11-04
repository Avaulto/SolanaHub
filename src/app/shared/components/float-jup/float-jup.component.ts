import { Component, inject, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { BlockheightBasedTransactionConfirmationStrategy, Connection, PublicKey } from '@solana/web3.js';
import { toastData } from 'src/app/models';
import { PortfolioFetchService, SolanaHelpersService, ToasterService, UtilService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import va from '@vercel/analytics';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
// import { getPlatformFeeAccounts } from '@jup-ag/react-hook';

declare global {
  interface Window {
    Jupiter: JupiterTerminal;
  }
}
interface IInit {
  /** Solana RPC, declare either endpoint, or Connection object */
  /** Solana RPC endpoint */
  endpoint?: string;
  /** Solana RPC Connection object */
  connectionObj?: Connection;

  /** TODO: Update to use the new platform fee and accounts */
  platformFeeAndAccounts?: any; // PlatformFeeAndAccounts;
  /** Configure Terminal's behaviour and allowed actions for your user */
  formProps?: any;
  /** Only allow strict token by [Jupiter Token List API](https://station.jup.ag/docs/token-list/token-list-api) */
  strictTokenList?: boolean;
  /** Default explorer for your user */
  defaultExplorer?: any;
  /** Auto connect to wallet on subsequent visits */
  autoConnect?: boolean;
  /** Use user's slippage instead of initialSlippageBps, defaults to true */
  useUserSlippage?: boolean;
  /** TODO: NOT Supported yet, presets of slippages, defaults to [0.1, 0.5, 1.0] */
  slippagePresets?: number[];

  /** Display & Styling */

  /** Display mode */
  displayMode?: 'modal' | 'integrated' | 'widget';
  /** When displayMode is 'integrated', this is the id of the element to render the integrated widget into */
  integratedTargetId?: string;
  /** When displayMode is 'widget', this is the behaviour and style of the widget */
  widgetStyle?: {
    position?: string;
    size?: string;
  };
  /** In case additional styling is needed for Terminal container */
  containerStyles?: any; // CSSProperties;
  /** In case additional styling is needed for Terminal container */
  containerClassName?: string;

  /** When true, wallet connection are handled by your dApp, and use `syncProps()` to syncronise wallet state with Terminal */
  enableWalletPassthrough?: boolean;
  /** Optional, if wallet state is ready, you can pass it in here, or just use `syncProps()` */
  passthroughWalletContextState?: any; // WalletContextState;
  /** When enableWalletPassthrough is true, this allows Terminal to callback your dApp's wallet connection flow */
  onRequestConnectWallet?: () => void | Promise<void>;

  /** Callbacks */
  /** When an error has occured during swap */
  onSwapError?: ({
    error,
    quoteResponseMeta,
  }: {
    error?: any; // TransactionError;
    quoteResponseMeta: any; // QuoteResponseMeta | null;
  }) => void;
  /** When a swap has been successful */
  onSuccess?: ({
    txid,
    swapResult,
    quoteResponseMeta,
  }: {
    txid: string;
    swapResult: any; //SwapResult;
    quoteResponseMeta: any; // QuoteResponseMeta | null;
  }) => void;
  /** Callback when there's changes to the form */
  onFormUpdate?: (form: any) => void; // IForm
  /** Callback when there's changes to the screen */
  onScreenUpdate?: (screen: any) => void; // IScreen

  /** Ask jupiter to quote with a maximum number of accounts, essential for composing with Jupiter Swap instruction */
  maxAccounts?: number;
  /** Request Ix instead of direct swap */
  onRequestIxCallback?: (ixAndCb: any) => Promise<void>; // IOnRequestIxCallback

  /** Internal resolves */

  /** Internal use to resolve domain when loading script */
  scriptDomain?: string;
}

interface JupiterTerminal {
  // _instance: JSX.Element | null;
  init: (props: IInit) => void;
  resume: () => void;
  close: () => void;
  // root: Root | null;

  /** Passthrough */
  enableWalletPassthrough: boolean;
  onRequestConnectWallet: IInit['onRequestConnectWallet'];
  // store: ReturnType<typeof createStore>;
  syncProps: (props: { passthroughWalletContextState?: IInit['passthroughWalletContextState'] }) => void;

  /** Callbacks */
  onSwapError: IInit['onSwapError'];
  onSuccess: IInit['onSuccess'];
  onFormUpdate: IInit['onFormUpdate'];
  onScreenUpdate: IInit['onScreenUpdate'];

  /** Request Ix instead of direct swap */
  onRequestIxCallback: IInit['onRequestIxCallback'];
}
@Component({
  selector: 'float-jup',
  template: '<div id="integrated-terminal"></div>',
  styles: `#jupiter-terminal-instance  button{    background: var(--ion-color-secondary) !important;color:white !important;}`,
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class FloatJupComponent implements OnInit {
  

  private _utils = inject(UtilService);
  private _toast = inject(ToasterService);
  private _portfolioFetchService = inject(PortfolioFetchService);
  private _loyaltyLeagueService = inject(LoyaltyLeagueService)  
  private _shs = inject(SolanaHelpersService)
  async ngOnInit() {

    if (!window.Jupiter) {
      this.initJupiter()
    }
  }
  async initJupiter() {
    await this.importJupiterTerminal();
    const referralAccountPubkey = new PublicKey(environment.platformFeeCollector);
  //  const feeAccounts =   new Map([
  //     [new PublicKey('So11111111111111111111111111111111111111112'), new PublicKey('HDZf2M4WSG7QjtGXYm1sB5ppdF75kxnBtPNcecDQzsWv')],
  //     [new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), new PublicKey('EdxKJxGrSjKo1oqpnz3aKLtcAo6NRTU8FP2UMxYG4T7q')],
  //     [new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'), new PublicKey('Bj1cuGGjRyqUFn3cXsweK4bm7ubRaYwbvnbjXqH7M6Rm')],
  //     [new PublicKey('HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX'), new PublicKey('9YuPukisRrktn2wN2Nqd7zqaRWf2rBVAsN9S2vEqQPXX')],

  //   ])
    const mintAddress = [
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
      new PublicKey('HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX'),
    ];
    const feeAccountMap = new Map<string, PublicKey>();
    
    for (const mint of mintAddress) {
      const [feeAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral_ata"),
          referralAccountPubkey.toBuffer(),
          mint.toBuffer(),
        ],
        new PublicKey("REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3")
      );
      // feeAccounts.push(feeAccount);
      // @ts-ignore
      feeAccountMap.set(mint.toBase58(), feeAccount);

      console.log(mint.toBase58(), feeAccount.toBase58());
    }
    console.log(feeAccountMap);
    const platformFeeAndAccounts = {
      feeBps: 50,
      referralAccountPubkey,
      feeAccounts: feeAccountMap,
    };
    // console.log(feeAccount.toBase58(), platformFeeAndAccounts);
    // const TEST_PLATFORM_FEE_AND_ACCOUNTS = {
    //   referralAccount: new PublicKey('68xFR3RfPvV4NpP1wd546j5vCWrFmVhw4PgmXZBcayP1'),
    //   feeBps: 100,
    //   feeAccounts: new Map([
    //     [new PublicKey('So11111111111111111111111111111111111111112'), new PublicKey('HDZf2M4WSG7QjtGXYm1sB5ppdF75kxnBtPNcecDQzsWv')],
    //     [new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), new PublicKey('133bwVgQTojGvM1ZV5Jv3roERdG1U2vnHgjDQv1Bsr7N')],
    //     [new PublicKey('EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm'), new PublicKey('D9b86zb6sEy5di9Aihnid8bhfBSDVzUsxMpmfmrabnMi')],
    //     [new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'), new PublicKey('5SUGzqWdr9mPxQa9FuNJAwdW1xq74mg1PYZKsFhW9QqL')],
    //     [new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'), new PublicKey('7fPHGWSJk7UXyU8Xic9GS1ZKu7iCJ5CTNnZYWs4z71eo')],
    //     [new PublicKey('HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX'), new PublicKey('AexWpSeZamHoJFNFx1mEr4Js2yGoitcpwnzSauY5uwC8')],
    //     [new PublicKey('vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7'), new PublicKey('H5MTAEchM7TmnzWQDP9RvvEHcAaCHJCw1x5VTTmF9Lfo')],
    //     [new PublicKey('bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1'), new PublicKey('2Qaxug24KuosaCbhCH2FnMMDKscYJDdKMkTau5i3xpJX')],
  
    //   ]),
    // };


    window.Jupiter.init({
      displayMode: "widget",
      integratedTargetId: "integrated-terminal",
      endpoint: this._utils.RPC,
      platformFeeAndAccounts,
      onSuccess: ({ txid, swapResult }) => {
        va.track('swap', { txid });
        const url = `${this._utils.explorer}/tx/${txid}?cluster=${environment.solanaEnv}`

        const txSend: toastData = {
          message: `Swap successful`,
          btnText: `view on explorer`,
          segmentClass: "toastInfo",
          duration: 3000,
          cb: () => window.open(url)
        }
        this._toast.msg.next(txSend);
        this._loyaltyLeagueService.completeQuest(this._shs.getCurrentWallet().publicKey.toBase58(), 'swapOnSolanaHub')

        setTimeout(() => {
          this._portfolioFetchService.triggerFetch();
        }, 2000);
        console.log({ txid, swapResult });
      },
      onSwapError: ({ error }) => {
        const txSend: toastData = {
          message: `Swap failed`,
          // btnText: `view on explorer`,
          segmentClass: "toastError",
          duration: 3000,
          // cb: () => window.open(txid)
        }

        this._toast.msg.next(txSend);
        console.log('onSwapError', error);
      },
      defaultExplorer: 'solscan',
      widgetStyle: {
        position: "bottom-right",
        size: "sm"
      }
    });

    console.log(window.Jupiter);
    
  }

  async importJupiterTerminal() {
    // create a script element and turn it to promise
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v3.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);
    return new Promise((resolve, reject) => {
      script.onload = () => resolve(window.Jupiter);
      script.onerror = () => reject(new Error('Failed to load jupiterTerminal'));
    });
  }
}
