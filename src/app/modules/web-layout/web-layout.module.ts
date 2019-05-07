import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebLayoutRoutingModule } from './web-layout-routing.module';
import {WebLayoutComponent} from './web-layout.component';
import {NumbersOnlyDirective} from '../../directives/numbers-only.directive';
import {AutoFocusDirective} from '../../directives/auto-focus.directive';

@NgModule({
    declarations: [
        WebLayoutComponent
    ],
    imports: [
        CommonModule,
        WebLayoutRoutingModule,
    ]
})
export class WebLayoutModule { }
