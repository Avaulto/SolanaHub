import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pools',
  templateUrl: './pools.page.html',
  styleUrls: ['./pools.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PoolsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
