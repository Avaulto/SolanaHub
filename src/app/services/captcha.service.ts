import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private captchaVerified = new BehaviorSubject<boolean>(false);
  captchaVerified$ = this.captchaVerified.asObservable();

  setCaptchaVerified(verified: boolean) {
    this.captchaVerified.next(verified);
    if (verified) {
      localStorage.setItem('captchaVerified', 'true');
    }
  }

  isCaptchaVerified(): boolean {
    return localStorage.getItem('captchaVerified') === 'true' || this.captchaVerified.value;
  }
}