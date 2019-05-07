import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FleteComponent} from './components/flete/flete.component';
import {GatosLocalesComponent} from './components/gatos-locales/gatos-locales.component';
import {AduanasComponent} from './components/aduanas/aduanas.component';
import {TransporteTerrestreComponent} from './components/transporte-terrestre/transporte-terrestre.component';
import {AlmacenajesTerminalesComponent} from './components/almacenajes-terminales/almacenajes-terminales.component';

const routes: Routes = [
    { path: 'flete', component: FleteComponent },
    { path: 'aduanas', component: AduanasComponent },
    { path: 'gastos-locales', component: GatosLocalesComponent },
    { path: 'transporte-terrestre', component: TransporteTerrestreComponent },
    { path: 'almacenaje-terminales', component: AlmacenajesTerminalesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarifarioRoutingModule { }
