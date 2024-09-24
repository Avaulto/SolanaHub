import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Lottie from 'lottie-web';
import { LoyaltyLeagueService } from 'src/app/services/loyalty-league.service';
@Component({
  selector: 'll-v2-loader',
  templateUrl: './v2-loader.component.html',
  styleUrls: ['./v2-loader.component.scss'],
  standalone: true
})
export class V2LoaderComponent  implements AfterContentInit {
  @ViewChild('animationEl', {static:true}) animationEl: ElementRef<any>
  constructor(private _loyaltyLeagueService: LoyaltyLeagueService) { }

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
  counter = 0 
  clickToHide(){
    this.counter++
    if(this.counter > 4){
      this._loyaltyLeagueService.hideLLv2.set(false)
    }
  }
}
