import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TarifarioRoutingModule } from './tarifario-routing.module';
import { FleteComponent } from './components/flete/flete.component';
import { TypeaheadModule} from 'ngx-bootstrap/typeahead';
import { FormsModule } from '@angular/forms';
import {BsDatepickerModule, ModalModule, PaginationModule} from 'ngx-bootstrap';
import { GatosLocalesComponent } from './components/gatos-locales/gatos-locales.component';
import { AduanasComponent } from './components/aduanas/aduanas.component';
import { AlmacenajesTerminalesComponent } from './components/almacenajes-terminales/almacenajes-terminales.component';
import { TransporteTerrestreComponent } from './components/transporte-terrestre/transporte-terrestre.component';
import {SharedDirectivesModule} from '../../../directives/SharedDirectivesModule';

@NgModule({
  declarations: [
      FleteComponent,
      GatosLocalesComponent,
      AduanasComponent,
      AlmacenajesTerminalesComponent,
      TransporteTerrestreComponent,
  ],
  imports: [
      CommonModule,
      TarifarioRoutingModule,
      FormsModule,
      TypeaheadModule.forRoot(),
      BsDatepickerModule.forRoot(),
      ModalModule.forRoot(),
      PaginationModule.forRoot(),
      SharedDirectivesModule
  ]
})
export class TarifarioModule { }
