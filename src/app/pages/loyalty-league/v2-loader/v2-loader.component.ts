import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Lottie from 'lottie-web';
@Component({
  selector: 'app-v2-loader',
  templateUrl: './v2-loader.component.html',
  styleUrls: ['./v2-loader.component.scss'],
})
export class V2LoaderComponent  implements AfterContentInit {
  @ViewChild('animationEl', {static:true}) animationEl: ElementRef<any>
  constructor() { }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.startAnim()
  }
  startAnim() {
    Lottie.loadAnimation({
      container: this.animationEl.nativeElement, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/hubbie-anim.json' // the path to the animation json
    });
  }
}