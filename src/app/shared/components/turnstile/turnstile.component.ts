import { Component, NgZone, OnInit } from '@angular/core';
import { PortfolioService } from 'src/app/services';
declare var turnstile: any
@Component({
  selector: 'app-turnstile',
  template: `<span id="#ts-container"></span>`,
  styleUrls: ['./turnstile.component.scss'],
  standalone: true
})
export class TurnstileComponent implements OnInit {

  constructor(private _portfolio: PortfolioService, private _zone: NgZone) { }

  ngOnInit() {
    this._zone.runOutsideAngular(() => {
      this._importTurnStile()
    })
  }
  private _importTurnStile() {

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    document.head.appendChild(script);
    script.addEventListener('load', () => {

      turnstile.render('#ts-container', {
        sitekey: '0x4AAAAAAAVqd3Q0Le6TMHMl',
        callback: (token) => {
          this._portfolio.tnToken = token

        },
      });
    })

  }

}
