import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {IonButton, IonImg, IonText, IonLabel } from '@ionic/angular/standalone';
import lottie from "lottie-web";
import {
  style,
  animate,
  trigger,
  transition,
} from "@angular/animations";
@Component({
  selector: 'promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss'],
  standalone: true,
  imports: [IonButton, IonImg, IonLabel, IonText],
  animations: [
    trigger('easeOut', [
      transition('* => void', [
          style({
              opacity: 1
          }),
          animate("500ms ease-in-out", style({
              opacity: 0
          }))
      ])
    ]),
    trigger('easeIn', [
      transition('void => *', [
        style({
            opacity: 0
        }),
        animate("500ms ease-in-out", style({
            opacity: 1
        }))
    ]),
    ]),
    trigger("fadeAnimation", [
      transition("false=>true", [
        style({ opacity: 0 }),
        animate("500ms", style({ opacity: 1 }))
      ]),
      //when we write '500ms  100ms' means that the animation spend 500ms, and start afer 100ms
      transition("true=>false", [animate("500ms 1000ms", style({ opacity: 0 }))])
    ]),
    
  ]
})
export class PromoComponent implements AfterViewInit {
  @ViewChild('animationEl', { static: false }) animationEl: ElementRef;
  public wordCarousel = ["Low value assets", "Empty accounts", "Stake accounts", "DeFi positions"];
  public wordCounter = -1;
  toggle: boolean = true;
  @Output() onStartAnalyze = new EventEmitter()
  @ViewChild("wordCarousel", { static: false }) wordCarouselEl: ElementRef;
  public preview = true;
  constructor() { }

  startAnalyze(){
    this.preview = false;
    setTimeout(() => {
      
      this.startAnim()
    });

    // setTimeout(() => {
      this.onStartAnalyze.emit()
    // }, 5000);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.toggle = false;
    })

  }
  nextWord(event: any) {
    this.toggle = !this.toggle;
    if (event.fromState)
      this.wordCounter = (this.wordCounter + 1) % this.wordCarousel.length;
  }

  startAnim(){
    lottie.loadAnimation({
      container: this.animationEl.nativeElement, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/images/placeholder-animation.json' // the path to the animation json
    });
  }
}
