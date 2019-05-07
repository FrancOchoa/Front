import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTrackingRoutingModule } from './customer-tracking-routing.module';
import { CustomerTrackingComponent } from './customer-tracking.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { ListClientsComponent } from './components/list-clients/list-clients.component';
import { FormExtraDataComponent } from './components/form-extra-data/form-extra-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormCommentComponent } from './components/form-comment/form-comment.component';
import { ListCommentsComponent } from './components/list-comments/list-comments.component';
import { PopoverModule} from 'ngx-bootstrap/popover';
import {BsDatepickerModule, BsDropdownModule, ModalModule, ProgressbarModule, TabsModule, TimepickerModule} from 'ngx-bootstrap';
import { FullCalendarModule } from 'ng-fullcalendar';

@NgModule({
  declarations: [
      CustomerTrackingComponent,
      FormRegisterComponent,
      ListClientsComponent,
      FormExtraDataComponent,
      FormCommentComponent,
      ListCommentsComponent
  ],
  imports: [
      CommonModule,
      CustomerTrackingRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      PopoverModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TimepickerModule.forRoot(),
      ProgressbarModule.forRoot(),
      TabsModule.forRoot(),
      BsDropdownModule.forRoot(),
      ModalModule.forRoot(),
      FullCalendarModule,
  ],
  providers: []
})
export class CustomerTrackingModule { }
