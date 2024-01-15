import { Pipe, PipeTransform } from "@angular/core";
import { PriceHistoryService } from "src/app/services/price-history.service";
declare global {
    interface Date {
      addDays(): Function;
    }
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

  
@Pipe({ name: "solValue" })
export class SolConverterPipe implements PipeTransform {
constructor(private _phs:PriceHistoryService){
    
}
  transform(value) {
    const res  = this._phs.getTokenDataByAddress('solana');

    
    return (value / 100).toFixedNoRounding(3) + '◎';
  }
}
