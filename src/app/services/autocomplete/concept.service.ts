import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ConceptService {
    constructor(private http: HttpClient) {}
    search(text: string) {
        return this.http.post<any>(`${environment.api.url}concepts/search`, {text: text})
            .pipe(response => {
                return response;
            });
    }
}