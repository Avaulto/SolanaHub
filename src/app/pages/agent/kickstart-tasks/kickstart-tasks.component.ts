import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'kickstart-tasks',
  templateUrl: './kickstart-tasks.component.html',
  styleUrls: ['./kickstart-tasks.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton,IonIcon]
})
export class KickstartTasksComponent  implements OnInit {
  @Output() onSendMessage = new EventEmitter<string>();
  constructor() { 
    addIcons({searchOutline,cloudDownloadOutline});
  }

  ngOnInit() {}

  sendMessage(task: string) {
    this.onSendMessage.emit(task);
  }
  public quickTasks = [
    {
      task: 'What hubSOL apy?',
      icon: 'search-outline',
    },
    {
      task: 'How loyalty league points are calculated?',
      icon: 'search-outline',
    },
    {
      task: 'Hubbie, fetch jup price',
      icon: 'cloud-download-outline',
    },
    {
      task: 'what madlad floor price?',
      icon: 'search-outline',
    }
  ]
}
