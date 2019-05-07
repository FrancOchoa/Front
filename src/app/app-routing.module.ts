import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './modules/admin-layout/admin-layout.module#AdminLayoutModule', canActivate: [AuthGuard] },
  { path: 'web', loadChildren: './modules/web-layout/web-layout.module#WebLayoutModule' },
  { path: 'login', loadChildren: './modules/auth/auth.module#AuthModule' }
  /*{ path: 'customer-tracking', loadChildren: './modules/commercial/customer-tracking#CustomerTrackingModule' },
	{ path: 'register', component: RegisterComponent },*/
  /*{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },*/
  /*{ path: '**', component: Page404Component },*/
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
