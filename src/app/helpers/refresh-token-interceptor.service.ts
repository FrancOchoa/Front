import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import {catchError, switchMap, finalize, filter, take, map} from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenInterceptorService implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(public auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse |
      HttpProgressEvent | HttpResponse<any> |
      HttpUserEvent<any> | any> {
      const user_id: number = Number(localStorage.getItem('user_id'));
      const company_id: number = Number(localStorage.getItem('company_id'));
      if (request.body) {
          request.body.company_id = company_id;
          request.body.created_by = user_id;
      } else {
          request = request.clone({
              body: {
                  company_id: company_id,
                  created_by: user_id,
              }
          });
      }
    //request = this.addTokenToRequest(request);
    return next.handle(request)
                .pipe(
                    map((response: any) => {
                        if (response.type === 4 && response.body.title !== undefined) {
                            Swal.fire({
                                title: response.body.title,
                                html: response.body.message,
                                type: response.body.type,
                            });
                        }
                        return response;
                    }),
                    catchError(error => {
                        if (error instanceof HttpErrorResponse) {
                            switch ((<HttpErrorResponse>error).status) {
                                case 0:
                                    const _error = {
                                        title: '¡Uy! Algo salió mal',
                                        type: 'error',
                                        message: 'Servidor no disponible.',
                                    };
                                    return this.defaultError(_error);
                                case 400:
                                    return <any>this.auth.logout();
                                /*case 401:
                                    return this.handle401Error(request, next);*/
                                case 422:
                                    return this.handle422Error(error.error.data);
                                default:
                                    return this.defaultError(error.error);
                            }
                        } else {
                            return throwError(error);
                        }
                }));
  }

  private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.access_token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.access_token}`
        }
      });
    }

    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);
      return this.auth.refreshAccessToken()
                      .pipe(
                        switchMap(response => {
                          if (response && response.access_token) {
                            this.refreshTokenSubject.next(response.access_token);
                            return next.handle(this.addTokenToRequest(request));
                          }
                          return <any>this.auth.logout();
                        }),
                        catchError(error => {
                          return <any>this.auth.logout();
                        }),
                        finalize(() => {
                          this.refreshTokenInProgress = false;
                        })
                      );
    } else {
      this.refreshTokenInProgress = false;
      return this.refreshTokenSubject
                  .pipe(
                    filter(access_token => access_token != null),
                    take(1),
                    switchMap(() => next.handle(this.addTokenToRequest(request)))
                  );
    }
  }

  private handle422Error(errors) {
      const data: Array<any> = errors;
      let text = '<div class="text-center text-muted">';
      for (const prop in data) {
          text += '<p class="m-0">' + `${data[prop]}` + '</p>';
      }
      text += '<div>';

      return Swal.fire({
          title: '¡Uy! Algo salió mal',
          html: text,
          type: 'error'
      });
  }

  private defaultError(error) {
      return Swal.fire({
          title: error.title,
          html: error.message,
          type: error.type
      });
  }
}
