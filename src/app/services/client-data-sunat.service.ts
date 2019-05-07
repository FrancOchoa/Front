import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientDataSunatService {

  constructor(private http: HttpClient) { }

  find(ruc: string) {
    return this.http.get<any>(`${environment.domain}api-external/sunat/consulta-ruc/${ruc}`);
  }
}
