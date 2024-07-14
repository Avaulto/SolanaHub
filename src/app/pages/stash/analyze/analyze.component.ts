import { Component, ElementRef, EventEmitter, OnInit, Output, signal, ViewChild } from '@angular/core';
import {
  style,
  animate,
  trigger,
  state,
  transition,
  AnimationBuilder,
  AnimationPlayer
} from "@angular/animations";
@Component({
  selector: 'analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss'],
  standalone:true,
  imports: [],
  animations: [
    trigger("fadeAnimation", [
      transition("false=>true", [
        style({ opacity: 0 }),
        animate("500ms", style({ opacity: 1 }))
      ]),
      //when we write '500ms  100ms' means that the animation spend 500ms, and start afer 100ms
      transition("true=>false", [animate("500ms 1000ms", style({ opacity: 0 }))])
    ])
  ]
})
export class AnalyzeComponent  implements OnInit {
  public wordCarousel = ["Empty accounts", "Stake accounts", "Useless SPL"];
  public wordCounter = -1;
  toggle:boolean=true;
  @Output() onStartAnalyze = new EventEmitter()
  @ViewChild("wordCarousel", { static: false }) wordCarouselEl: ElementRef;
  constructor() { }

  ngOnInit() {
  
  }



  ngAfterViewInit() {
    setTimeout(()=>{
    this.toggle=false;
    })

    setTimeout(() => {
      this.onStartAnalyze.emit()
    }, 5000);
  }
  nextWord(event: any) {
      this.toggle = !this.toggle;
      if (event.fromState)
        this.wordCounter = (this.wordCounter + 1) % this.wordCarousel.length;
  }
  

}
