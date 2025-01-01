import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
declare global {
 
  interface turnstile{any}
}
@Component({
  selector: 'turnstile-captcha',
  template: `<div class="cf-turnstile" [attr.data-sitekey]="turnStileKey" #turnstileElement></div>`,
  styleUrls: ['./turnstile-captcha.component.scss'],
  standalone: true,
})
export class TurnstileCaptchaComponent implements OnInit {
  private readonly _apiUrl = environment.apiUrl;
  @ViewChild('turnstileElement') turnstileElement!: ElementRef;
  userResponse: string = '';
  turnStileKey = '0x4AAAAAAA4WqpozOOvZlJ3e';
  constructor() {}
  _turnstileCb() {
    console.log('_turnstileCb called');

    (window as any).turnstile.render(this.turnstileElement.nativeElement, {
      sitekey: this.turnStileKey,
      theme: 'light',
      callback: (token: string) => {
        console.log(`Challenge Success ${token}`);
        this.submitForm(token);
      },
    });
}
  async ngOnInit(): Promise<void> {
    try {
      await this.initTurnstile();
      this._turnstileCb();
    } catch (error) {
      console.error('Failed to load Turnstile:', error);
    }
  }
  private initTurnstile(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }
  async submitForm(turnstileResponse: string) {

    if (turnstileResponse) {
      this.userResponse = turnstileResponse;

      // Send the response to your server for validation
      try {
        const response = await fetch(`${this._apiUrl}/api/verify-turnstile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ turnstileToken: this.userResponse }),
        });
        const data = await response.json();
        if (data.success) {
            // Redirect to the original website
            window.location.href = 'https://www.original-website.com';
          } else {
            console.log('CAPTCHA verification failed. Please try again.');
          }
        } catch (error) {
          console.error('Error verifying CAPTCHA:', error);
            console.log('Error occurred during CAPTCHA verification.');
          }
    } else {
      console.log('Please complete the CAPTCHA');
    }
  }
}
