import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(cargos: Array<number>) {
    const data = {cargos: cargos, company_id: environment.user.company};
    return this.http.post(`${environment.api.url}users`, data);
  }
}
