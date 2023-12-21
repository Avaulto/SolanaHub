import { ChangeDetectorRef, Directive, ElementRef, HostBinding, HostListener, Input, NgZone, OnChanges, Renderer2, ViewRef } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular/standalone';
@Directive({
  selector: '[skeletonPh]',
  standalone: true,

})
export class SkeletonPhDirective implements OnChanges {
  @Input() content  = ''
  private elRef: ElementRef<any> = this.el.nativeElement;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.content){
      this.renderer.removeChild(this.el.nativeElement, this.elRef);
    }
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // Create a new element
    // let placeholderEl = new IonSkeletonText(this.cdr, this.el, this.ngZone);

    const newElement = this.renderer.createElement('ion-skeleton-text');

    // Set the inner HTML of the new element
    // this.renderer.setProperty(newElement, 'innerHTML', this.appAppendHtml);

    // Append the new element to the host element
    this.renderer.appendChild(this.elRef, newElement);

  }

  @Input() copyText: string;
  @HostListener('click') copyToClipboard() {
    try {
      navigator.clipboard.writeText(this.copyText).then();;
    } catch (error) {
      console.error(error)
    }
  }
}