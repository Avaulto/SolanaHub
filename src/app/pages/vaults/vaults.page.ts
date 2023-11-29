import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.page.html',
  styleUrls: ['./vaults.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VaultsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
