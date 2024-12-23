import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonTextarea, IonButton, IonIcon, IonImg, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
import { AgentActionsService } from '../agent-actions.service';
@Component({
  selector: 'chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonButton, IonTextarea, IonIcon, IonImg],
})
export class ChatBoxComponent implements OnInit {
  @Input() prompt: string = '';
  @ViewChild('chatBoxBody') chatBoxBody!: ElementRef;
  messages: string[] = [];
  hubbieResponse: string = '';
  isLoading: boolean = false;

  constructor(private _agentActionsService: AgentActionsService) {
    addIcons({ send });
  }

  ngOnInit() { }
  scrollToBottom() {
    const container = this.chatBoxBody.nativeElement;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth', // Optional: Smooth scrolling
    });
  }
  async sendMessage() {
    console.log('sendMessage', this.prompt);
    try {
      const prompt = this.prompt;
      this.prompt = '';
      this.messages.push(prompt);
      this.isLoading = true;
      this.hubbieResponse = 'Hubbie is thinking...';
      setTimeout(() => {
        this.scrollToBottom();
      });
      this.hubbieResponse = await this._agentActionsService.askAgent(prompt)
      this.messages.push(this.hubbieResponse);
      setTimeout(() => {
        this.scrollToBottom();
      });
      this.isLoading = false;
    } catch (error) {
      console.error('Error sending message', error);
    }


  }
}
