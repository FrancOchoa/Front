import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PortService {
    constructor(private http: HttpClient) {}
    search(text: string, port: number) {
        return this.http.post<any>(`${environment.api.url}ports/search`, {text: text, port: port})
            .pipe(response => {
                return response;
            });
    }
}