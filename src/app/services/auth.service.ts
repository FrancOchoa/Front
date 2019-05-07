import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: User) {
    //const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    let data = {
      'username': user.email,
      'password': user.password,
      'grant_type': 'password',
      'client_id': '2',
      'client_secret': 'D2TAGnqI6ZXF1UCqOVq6pplLcxgYA24M2gPd3G1o'
    }

    return this.http.post<any>(`${environment.api.oauth}token`, data)
                    .pipe(map(response => {
                      if(response && response.access_token){
                        localStorage.setItem('currentUser', JSON.stringify(response));
                      }
                      return response;
                    }))
  }

  logout() {
    localStorage.removeItem('currentUser')
  }

  refreshAccessToken() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let data = {
      'grant_type': 'refresh_token',
      'refresh_token': currentUser.refresh_token,
      'client_id': '2',
      'client_secret': 'D2TAGnqI6ZXF1UCqOVq6pplLcxgYA24M2gPd3G1o'
    }

    return this.http.post<any>(`${environment.api.oauth}token`, data)
                    .pipe(map(response => {
                      if(response && response.access_token){
                        localStorage.setItem('currentUser', JSON.stringify(response));
                      }
                      return response;
                    }))
  }
}
