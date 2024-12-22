import { Component, OnInit } from '@angular/core';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { IonContent } from '@ionic/angular/standalone';
import { SolanaAgentKit, createSolanaTools } from "solana-agent-kit";
import { environment } from 'src/environments/environment';
import { Keypair } from '@solana/web3.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { SolanaBalanceTool, SolanaFetchPriceTool } from 'solana-agent-kit/dist/langchain';
import { fetchPrice } from 'solana-agent-kit/dist/tools';

import { PromoComponent } from './promo/promo.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { IonGrid } from '@ionic/angular/standalone';
import { KickstartTasksComponent } from './kickstart-tasks/kickstart-tasks.component'
@Component({
  selector: 'app-agent',
  templateUrl: './agent.page.html',
  styleUrls: ['./agent.page.scss'],
  standalone: true,
  imports: [
    PageHeaderComponent,
     IonContent, 
     ChatBoxComponent, 
     PromoComponent, 
     IonGrid, 
     KickstartTasksComponent
    ]
})
export class AgentPage implements OnInit {
  showAgentPromo = true;
  constructor() { }

  ngOnInit() {
    // this.initAgentKit();
  }

  
  public quickTaskPrompt = '';
  sendMessage(task: string) {
    this.quickTaskPrompt = task;
  }
}
