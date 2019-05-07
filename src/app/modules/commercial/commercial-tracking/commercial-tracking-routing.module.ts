import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommercialTrackingComponent} from './commercial-tracking.component';

const routes: Routes = [
    { path: '', component: CommercialTrackingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommercialTrackingRoutingModule { }
