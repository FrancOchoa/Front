import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshTokenInterceptorService } from './helpers/refresh-token-interceptor.service';
/* My Modules */
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthGuard} from './guards/auth.guard';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptorService, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
