import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {
  @Input() public appAutoFocus: Boolean;
  constructor(private el: ElementRef) { }
  ngAfterContentInit(): void {
    if (this.appAutoFocus) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 100);
    }
  }
}
