import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lending',
  templateUrl: './lending.page.html',
  styleUrls: ['./lending.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LendingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
