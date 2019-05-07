import {NgModule} from '@angular/core';
import {AutoFocusDirective} from './auto-focus.directive';
import {NumbersOnlyDirective} from './numbers-only.directive';

@NgModule({
    declarations: [
        AutoFocusDirective,
        NumbersOnlyDirective
    ],
    imports: [],
    exports: [
        AutoFocusDirective,
        NumbersOnlyDirective
    ]
})
export class SharedDirectivesModule  { }