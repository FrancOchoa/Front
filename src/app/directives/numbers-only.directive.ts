import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {
    private decimalsQuantity = 2;
    // Allow decimal numbers
    private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'Enter', 'F5', 'ArrowLeft', 'ArrowRight', 'Delete' ];
    constructor(private el: ElementRef) { }
    @HostListener('keydown', [ '$event' ]) onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1 || (Number(event.key) >= 0 && Number(event.key) <= 9)) {
            return;
        }

        if (this.countDecimals() >= this.decimalsQuantity) {
            return false;
        }

        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);

        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }

    @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
        const value: number = this.el.nativeElement.value;

        if (value && !isNaN(value) && this.countDecimals() === this.decimalsQuantity) {
            const formatted = Number(value).toFixed(this.decimalsQuantity);
            this.el.nativeElement.value = formatted;
        }
    }

    countDecimals() {
        const value: number = this.el.nativeElement.value;

        let countDecimalPlaces = 0;
        const decimalPos = String(value).indexOf('.');

        if (decimalPos !== -1) {
            countDecimalPlaces = String(value).length - decimalPos - 1;
        }

        return countDecimalPlaces;
    }
}
