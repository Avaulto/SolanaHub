import {Injectable} from "@angular/core";
import {PublicKey} from "@solana/web3.js";

@Injectable({
  providedIn: "root"
})
export class AddressValidatorService {
  isValid(walletAddress: string): boolean {
    try {
      return !!new PublicKey(walletAddress) || PublicKey.isOnCurve(walletAddress);
    } catch (err) {
      return false;
    }
  }
}
