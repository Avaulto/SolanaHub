import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NftGalleryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
