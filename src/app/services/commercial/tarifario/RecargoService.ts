import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ICrud} from '../../../contracts/ICrud';

@Injectable({
    providedIn: 'root'
})
export class RecargoService implements ICrud {

    private api_url = `${environment.api.url}recargos`;

    constructor(private http: HttpClient) { }

    save(data: any) {
        return this.http.post(`${this.api_url}`, data);
    }

    search(params: any) {
        return this.http.post(`${this.api_url}/search`, params);
    }

    delete(id: number) {
        return this.http.delete(`${this.api_url}/${id}`, {});
    }

    edit(id: number) {}

    update(id: number, params: any) {}
}