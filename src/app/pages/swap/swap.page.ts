import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.page.html',
  styleUrls: ['./swap.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SwapPage implements OnInit {

  constructor() { }

  ngOnInit() {
    //@ts-ignore
    window.Jupiter.init({
      displayMode: "integrated",
      integratedTargetId: "integrated-terminal",
      endpoint: environment.solanaCluster,
      defaultExplorer: "SolanaFM",
      formProps: {
        fixedOutputMint: true,
        swapMode: "ExactOut",
        fixedAmount: true,
        initialAmount: "1000000000",
      },
    });
    
  }

}
