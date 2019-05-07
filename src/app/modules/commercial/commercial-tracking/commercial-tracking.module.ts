import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommercialTrackingRoutingModule } from './commercial-tracking-routing.module';
import {FormsModule} from '@angular/forms';
import {CommercialTrackingComponent} from './commercial-tracking.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
    declarations: [
        CommercialTrackingComponent
    ],
    imports: [
        CommonModule,
        CommercialTrackingRoutingModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot()
    ]
})
export class CommercialTrackingModule { }
