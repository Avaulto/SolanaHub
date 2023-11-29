import { Directive, HostBinding, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appCopyText]'
})
export class CopyTextDirective {
    @Input() copyText: string;
    @HostListener('click') copyToClipboard(){
      try {
        navigator.clipboard.writeText(this.copyText).then();;
      } catch (error) {
        console.error(error)
      }
    }
}