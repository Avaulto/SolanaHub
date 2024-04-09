import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IonRow, IonCol, IonSpinner, IonContent, IonGrid, IonHeader, IonButtons, IonMenuButton, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
declare var deBridge
@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.page.html',
  styleUrls: ['./bridge.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    IonSpinner,
    PageHeaderComponent,
    IonContent,
    IonGrid,
    IonHeader,
  ]
})
export class BridgePage implements OnInit {

  constructor() { }
  public widgetLoading: boolean = true
  async ionViewWillEnter() {
    console.log('page loaded');

    try {
      await this._importDeBridge()
      this.widgetLoading = false
      deBridge.widget({"v":"1","element":"debridgeWidget","title":"","description":"","width":"485","height":"620","r":null,"supportedChains":"{\"inputChains\":{\"1\":\"all\",\"10\":\"all\",\"56\":\"all\",\"137\":\"all\",\"8453\":\"all\",\"42161\":\"all\",\"43114\":\"all\",\"59144\":\"all\",\"7565164\":\"all\",\"245022934\":\"all\"},\"outputChains\":{\"7565164\":[\"\",\"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\"]}}","inputChain":1,"outputChain":7565164,"inputCurrency":"","outputCurrency":"","address":"","showSwapTransfer":false,"amount":"","outputAmount":"","isAmountFromNotModifiable":true,"isAmountToNotModifiable":true,"lang":"en","mode":"deswap","isEnableCalldata":false,"styles":"eyJhcHBCYWNrZ3JvdW5kIjoiI2ZmZmZmZiIsImFwcEFjY2VudEJnIjoicmdiYSgyNDgsMjQ4LDI0OCwwKSIsImJhZGdlIjoicmdiYSgyNTUsMjU1LDI1NSwwKSIsImJvcmRlclJhZGl1cyI6OCwicHJpbWFyeSI6IiM5YjM2NzgiLCJzZWNvbmRhcnkiOiIjODA0ZmIzIiwic3VjY2VzcyI6IiMxN2IyNmEiLCJlcnJvciI6IiNmMDQ0MzgiLCJ3YXJuaW5nIjoiI2Y3OTAwOSIsImljb25Db2xvciI6IiM4MDRmYjMiLCJmb250Q29sb3IiOiIjMDAwMDAwIiwiZm9udENvbG9yQWNjZW50IjoiI2ZmYWFlMiIsImZvbnRGYW1pbHkiOiJJbnRlciIsInByaW1hcnlCdG5UZXh0IjoiI2ZmZmZmZiIsInNlY29uZGFyeUJ0bkJnIjoicmdiYSgyNTUsMjU1LDI1NSwwKSIsImxpZ2h0QnRuQmciOiIifQ==","theme":"light","isHideLogo":true,"logo":""})
    } catch (error) {
      console.error(error);

    }
  }
  ngOnInit() {
  }
  private _importDeBridge = async () => {

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://app.debridge.finance/assets/scripts/widget.js";
      script.defer = true;
      script.type = 'module';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });



  }

}
