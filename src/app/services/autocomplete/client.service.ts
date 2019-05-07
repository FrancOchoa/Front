import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    constructor(private http: HttpClient) {}
    search(text: string) {
        return this.http.post<any>(`${environment.api.url}clients/search`, {text: text})
            .pipe(response => {
                return response;
            });
    }
}