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

  // async initAgentKit() {
  //   // generate new private key
  //   const privateKey = bs58.encode(Keypair.generate().secretKey);
  //   // Initialize with private key and optional RPC URL
  //   const agent = new SolanaAgentKit(
  //     privateKey,
  //     environment.solanaCluster,
  //     "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"
  //   );

  //   // Create LangChain tools
  //   const tools = createSolanaTools(agent);
  //   const price = await fetchPrice(
  //         agent,
  //         "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" // Token mint address
  //       );
    
  //   console.log("Price in USDC:", price);
  // }
  public quickTaskPrompt = '';
  sendMessage(task: string) {
    this.quickTaskPrompt = task;
  }
}
