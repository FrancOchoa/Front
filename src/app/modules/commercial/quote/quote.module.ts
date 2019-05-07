import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuoteRoutingModule } from './quote-routing.module';
import {QuoteComponent} from './quote.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {FormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SharedDirectivesModule} from '../../../directives/SharedDirectivesModule';

@NgModule({
    declarations: [
        QuoteComponent
    ],
    imports: [
        CommonModule,
        QuoteRoutingModule,
        FormsModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        TypeaheadModule.forRoot(),
        DragDropModule,
        SharedDirectivesModule
    ]
})
export class QuoteModule { }
