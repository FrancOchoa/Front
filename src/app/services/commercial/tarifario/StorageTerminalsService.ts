import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ICrud} from '../../../contracts/ICrud';

@Injectable({
    providedIn: 'root'
})
export class StorageTerminalsService implements ICrud {

    constructor(private http: HttpClient) { }

    chargeSelects() {
        return this.http.get<any>(`${environment.api.url}storage-terminals/create`);
    }

    paginate(page: number, search_text: string = '') {
        return this.http.get(`${environment.api.url}storage-terminals?page=${page}&search_text=${search_text}`);
    }

    save(data: any) {
        return this.http.post(`${environment.api.url}storage-terminals`, data);
    }

    search(params: any) {
        return this.http.post(`${environment.api.url}storage-terminals/search`, params);
    }

    delete(id: number) {
        return this.http.delete(`${environment.api.url}storage-terminals/${id}`, {});
    }

    edit(id: number) {
    }

    update(id: number, params: any) {
        return this.http.put(`${environment.api.url}storage-terminals/${id}`, params);
    }
}