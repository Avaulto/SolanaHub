import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VirtualStorageService } from './virtual-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  public captchaToken: string = '';
  constructor(private _vrs: VirtualStorageService) { }
  // set captchaVerified to true if captcha is verified
  private captchaVerified = new BehaviorSubject<boolean>(false);
  captchaVerified$ = this.captchaVerified.asObservable();

  setCaptchaVerified(verified: boolean) {
    this.captchaVerified.next(verified);
    if (verified) {
      // set expiration time to 30 minutes
      const expirationTime = Date.now() + 30 * 60 * 1000; // 30 minutes in milliseconds
      this._vrs.localStorage.saveData('captchaVerified', JSON.stringify({
        verified: true,
        expiration: expirationTime
      }));
    }
  }
  // check if captcha is verified by checking the expiration time skip the captcha
  isCaptchaVerified(): boolean {
    const captchaData = this._vrs.localStorage.getData('captchaVerified');
    if (!captchaData) return false;
    const { verified, expiration } = JSON.parse(captchaData);
    const isVerified = verified && expiration > Date.now();
    // Remove from localStorage if expired
    if (!isVerified) {
      this._vrs.localStorage.removeData('captchaVerified');
    }
    this.captchaVerified.next(isVerified);
    return isVerified;
  }
}
