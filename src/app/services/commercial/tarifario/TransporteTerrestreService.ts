import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {GastoLocal} from '../../../models/commercial/tarifario/GastoLocal';
import {map} from 'rxjs/operators';
import {ICrud} from '../../../contracts/ICrud';

@Injectable({
    providedIn: 'root'
})
export class TransporteTerrestreService implements ICrud {

    private url = `${environment.api.url}transporte-terrestre`;

    constructor(private http: HttpClient) { }

    chargeSelects() {
        return this.http.get<any>(`${this.url}/create`);
    }

    save(data: any) {
        return this.http.post(`${this.url}`, data);
    }

    search(params: any) { }

    delete(id: number) {
        return this.http.delete(`${this.url}/${id}`, {});
    }

    edit(id: number) {}

    update(id: number, params: any) {
        return this.http.put(`${this.url}/${id}`, params);
    }

    paginate(page: number, search_text: string, location: string, load: string) {
        return this.http.get(`${this.url}?page=${page}&search_text=${search_text}&location=${location}&load=${load}`);
    }
}