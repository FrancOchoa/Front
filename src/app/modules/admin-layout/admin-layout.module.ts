import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import {AdminLayoutComponent} from './admin-layout.component';
import {SidebarComponent} from '../partials/sidebar/sidebar.component';
import {FooterComponent} from '../partials/footer/footer.component';
import {NavbarComponent} from '../partials/navbar/navbar.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
  ]
})
export class AdminLayoutModule { }
