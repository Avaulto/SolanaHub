import { Pipe, PipeTransform } from "@angular/core";
import { SolanaUtilsService } from "src/app/services";

@Pipe({ name: "solValue" })
export class SolConverterPipe implements PipeTransform {
constructor(private _solanaUtilsService:SolanaUtilsService){

}
  transform(value) {
    return (value / this._solanaUtilsService.lastSolPrice()).toFixedNoRounding(3) + '◎';
  }
}
