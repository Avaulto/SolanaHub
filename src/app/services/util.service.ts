import { CurrencyPipe, DecimalPipe, DatePipe, PercentPipe } from "@angular/common";
import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { PublicKey } from "@solana/web3.js";
import { JupToken } from "../models/jup-token.model";
import { JupStoreService } from "./jup-store.service";
import { SessionStorageService } from "./session-storage.service";
import { Config, PriorityFee } from "../models/settings.model";
import { environment } from 'src/environments/environment';

declare global {
 
  interface Number {
    toFixedNoRounding: Function;
  }
}
Number.prototype.toFixedNoRounding = function (n) {
  const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
  const a = this.toString().match(reg)[0];
  const dot = a.indexOf(".");
  if (dot === -1) { // integer, insert decimal dot and pad up zeros
    return a + "." + "0".repeat(n);
  }
  const b = n - (a.length - dot) + 1;
  return b > 0 ? (a + "0".repeat(b)) : a;
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
    // private _jupStore:JupStoreService,
    private _sessionStorageService: SessionStorageService,
    private _localStorage: LocalStorageService
  ) {
  }
  private  _subDomain = location.host.split(".")[0] === 'dev' ? 'dev-api' : 'api';
  public serverlessAPI = location.hostname === "localhost" ? 'http://localhost:3000' : `https://${this._subDomain}.SolanaHub.app`

  

  public get RPC(): string{
    const config = JSON.parse(this._localStorage.getData('RPC'))?.value || environment.solanaCluster
    return config ;
  }

  public get explorer(): string{
    const config = JSON.parse(this._localStorage.getData('explorer'))?.value || 'https://solscan.io'
    return config ;
  }
  
  public get priorityFee()  {
    const baseFee = PriorityFee.Fast
    const config = Number(JSON.parse(this._localStorage.getData('priority-fee'))?.value) || baseFee
    console.log(config);
    
    return config;
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


  private jupTokens: JupToken[] = null

  public async getJupTokens(): Promise<JupToken[]> {
    //const env = TOKEN_LIST_URL[environment.solanaEnv]//environment.solanaEnv
    if (this.jupTokens) {
      return this.jupTokens
    } else {
      try {
        this.jupTokens = await (await fetch('https://token.jup.ag/all')).json();
        this.jupTokens.forEach(t => t.logoURI = t.logoURI ? t.logoURI : 'assets/images/unknown.svg');
      } catch (error) {
        console.error(error);
      }
    }
    return this.jupTokens
  }
  public addTokenData(assets: any, tokensInfo: JupToken[]): any[] {

    return assets.map((res: any) => {


      res.data.address === "11111111111111111111111111111111" ? res.data.address = "So11111111111111111111111111111111111111112" : res.data.address
      // const { symbol, name, logoURI, decimals } = tokensInfo.find(token => token.address === res.data.address)
      const token = tokensInfo.find(token => token.address === res.data.address)
      res.name = token?.name ? token.name : '';
      res.name === 'Wrapped SOL' ? res.name = 'Solana' : res.name
      res.symbol = token?.symbol ? token.symbol : '';
      res.imgUrl = token?.logoURI ? token.logoURI : 'assets/images/unknown.svg';
      res.decimals = token?.decimals ? token.decimals : '';;
      res.balance = res.data.amount
      return res
    }).map((item: any) => {
      Object.assign(item, item.data)
      delete item.amount
      delete item.data;

      return item
    })
  }
  public memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        // if(bytes < 1024) return bytes + " bytes";
        // else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        // else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        // else return(bytes / 1073741824).toFixed(3) + " GiB";
        return bytes
    };

    return formatByteSize(sizeOf(obj));
};

}
