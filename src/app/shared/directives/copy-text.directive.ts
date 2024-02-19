import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { ToasterService } from 'src/app/services';
@Directive({
  selector: '[appCopyText]',
  standalone: true
})
export class CopyTextDirective {
  constructor(private _toasterService: ToasterService) { }
  @Input() copyText: string;
  @HostListener('click') copyToClipboard() {
    try {
      this._toasterService.msg.next({
        message: `copied`,
        segmentClass: "toastInfo",
        duration: 500
      })
      navigator.clipboard.writeText(this.copyText).then();;
    } catch (error) {
      console.error(error)
    }
  }
}