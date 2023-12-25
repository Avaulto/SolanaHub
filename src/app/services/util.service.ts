import { CurrencyPipe, DecimalPipe, DatePipe, PercentPipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { PublicKey } from "@solana/web3.js";
import { JupToken } from "../models/jup-token.model";
// import { PriorityFee } from "../models/priorityFee.model";
// import * as moment from "moment";
// import { v4 as uuidv4 } from "uuid";

export enum PriorityFee {
  None = "0",
  Fast = "1",
  Supercharger = "3",
}

@Injectable({
  providedIn: "root",
})
export class UtilService {
  public currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
  public decimalPipe: DecimalPipe = new DecimalPipe('en-US');
  public percentPipe: PercentPipe = new PercentPipe('en-US');
  public datePipe: DatePipe = new DatePipe('en-US');
  constructor(
    private localStore: LocalStorageService) {
  }
  public serverlessAPI =  location.hostname === "localhost" ? 'http://localhost:3000' : 'https://dev-api.SolanaHub.app'

  private _systemExplorer = new BehaviorSubject<string>(this.localStore.getData('explorer') || 'https://solana.fm' as string);
  public explorer$ = this._systemExplorer.asObservable();
  public changeExplorer(name: string): void {
    this.localStore.saveData('explorer', name);
    this._systemExplorer.next(name);
  }
  get explorer(): string {
    return this._systemExplorer.value;
  }
  private _PriorityFee = PriorityFee.None;
  public get priorityFee(): PriorityFee {
    return this._PriorityFee;
  }


  public set priorityFee(v: PriorityFee) {
    this._PriorityFee = v;
  }

  public formatBigNumbers = (n: number) => {
    if (n < 1e3) return this.decimalPipe.transform(n, '1.2-2');
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    else return n;
  };


  public addrUtil = (addr: string): { addr: string, addrShort: string } => {
    //@ts-ignore
    return { addr, addrShort: addr?.substring(0, 4) + '...' + addr.substring(addr.length - 4, addr.length[addr.length]) }
  }

  public sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

  public isNotNull = <T>(source: Observable<T | null>) => source.pipe(filter((item: T | null): item is T => item !== null));
  public isNotUndefined = <T>(source: Observable<T | null>) => source.pipe(filter((item: T | null): item is T => item !== undefined));
  public isNotNullOrUndefined = <T>(source: Observable<T | null>) => source.pipe(filter((item: T | null): item is T => item !== null && item !== undefined));
  public validateAddress = (address: string): boolean => {
    return PublicKey.isOnCurve(address);
  }

  public async getJupTokens(): Promise<JupToken[]> {
    //const env = TOKEN_LIST_URL[environment.solanaEnv]//environment.solanaEnv
    let tokensList:JupToken[] = []
    try {
       tokensList = await (await fetch('https://token.jup.ag/all')).json();
       tokensList.forEach(t => t.logoURI = t.logoURI ?  t.logoURI : 'assets/images/unknown.svg');
    } catch (error) {
      console.error();
    }
    return tokensList
  }
  public addTokenData(assets: any,  tokensInfo: JupToken[]): any[] {
    return assets.map((res: any) => {
      res.data.address === "11111111111111111111111111111111" ? res.data.address = "So11111111111111111111111111111111111111112" : res.data.address
      // const { symbol, name, logoURI, decimals } = tokensInfo.find(token => token.address === res.data.address)
      const token = tokensInfo.find(token => token.address === res.data.address)
      res.name = token?.name ? token.name  : '';
      res.name === 'Wrapped SOL' ?  res.name = 'Solana' :  res.name 
      res.symbol = token?.symbol ? token.symbol  : '';
      res.imgUrl = token?.logoURI ? token.logoURI  : 'assets/images/unknown.svg';
      res.decimals = token?.decimals ? token.decimals  : '';;
      return res
    }).map((item: any) => {
      Object.assign(item, item.data)
      delete item.data;

      return item
    })
  }

  public getSolPrice(){
    try {
      const soldata = fetch('https://api.coingecko.com/api/v3')
    } catch (error) {
      
    }
  }
}
