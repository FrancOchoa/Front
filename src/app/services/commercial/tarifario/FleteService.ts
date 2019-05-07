import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ICrud} from '../../../contracts/ICrud';

@Injectable({
    providedIn: 'root'
})
export class FleteService implements ICrud {

    protected url = `${environment.api.url}fletes`;

    constructor(private http: HttpClient) { }

    chargeSelects() {
        return this.http.get<any>(`${this.url}/create`);
    }

    save(data: any) {
        return this.http.post(`${this.url}`, data);
    }

    search(params: any) {
        return this.http.post(`${this.url}/search`, params);
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/${id}`, {});
    }

    edit(id: number) {
    }

    update(id: number, params: any) {
        return this.http.put(`${this.url}/${id}`, params);
    }

    paginate(page: number, search_text: string, via_id: number, service_type_id: any) {
        return this.http.get(`${this.url}?page=${page}&search_text=${search_text}&via_id=${via_id}&service_type_id=${service_type_id}`);
    }
}
