import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonImg, IonLabel, IonText, IonButton } from '@ionic/angular/standalone';
@Component({
  selector: 'agent-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss'],
  standalone: true,
  imports: [IonImg, IonLabel, IonText, IonButton],
})
export class PromoComponent  implements OnInit {
  @Output() showAgent = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {}
  useAgent() {
    this.showAgent.emit()
  }
}
