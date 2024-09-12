import { DecimalPipe, NgClass, PercentPipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {  IonButton, IonLabel, IonCol, IonImg, IonGrid, IonRow, IonContent, IonText, IonSkeletonText } from "@ionic/angular/standalone";

import Lottie from 'lottie-web';

import {  UtilService } from 'src/app/services';

@Component({
  selector: 'app-hubsol',
  templateUrl: './hubsol.page.html',
  styleUrls: ['./hubsol.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonSkeletonText,
    DecimalPipe,
    NgClass,
    PercentPipe,
    IonText,
    IonContent,
    IonRow,
    IonGrid,
    IonImg,
    IonCol,
    IonLabel,
    IonButton,
  ]
})
export class HubsolPage implements OnInit {
  @ViewChild('animationEl', { static: true }) animationEl: ElementRef;
    protected api = inject(UtilService).serverlessAPI + '/api'
  public supportedPlatforms = [
    {
      img: 'assets/images/platforms/phantom.svg',
      type: 'wallet'
    },
    {
      img: 'assets/images/platforms/meteora.svg',
      type: 'AMM'
    },
    {
      img: 'assets/images/platforms/jup.svg',
      type: 'aggregator'
    },
    {
      img: 'assets/images/platforms/orca.svg',
      type: 'DEX'
    },
    {
      img: 'assets/images/platforms/solayer.svg',
      type: 'other'
    },
    {
      img: 'assets/images/platforms/solflare.svg',
      type: 'wallet'
    },
    {
      img: 'assets/images/platforms/kamino.svg',
      type: 'AMM'
    },
    {
      img: 'assets/images/platforms/raydium.svg',
      type: 'AMM'
    },
    {
      img: 'assets/images/platforms/mango.svg',
      type: 'DEX'
    },
   
    {
      img: 'assets/images/platforms/texture.svg',
      type: 'AMM'
    },
    // {
    //   img: 'assets/images/platforms/jup.svg',
    //   type: 'aggregator'
    // },
    // {
    //   img: 'assets/images/platforms/orca.svg',
    //   type: 'DEX'
    // }
  ]
  constructor(

  ) { }
  ngOnInit() {
    this.startAnim()
    this.getMetrics()
  }
  startAnim() {
    Lottie.loadAnimation({
      container: this.animationEl.nativeElement, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/hubSOL-anim.json' // the path to the animation json
    });
  }
  public metrics = signal(null)
  public async getMetrics() {
    const metrics = await (await fetch(`${this.api}/hubSOL/get-metrics`)).json()
    console.log(metrics);
    
    this.metrics.set(metrics)

  }
}
