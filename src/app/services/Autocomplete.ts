import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AutocompleteService {
    constructor(private http: HttpClient) {}
    searchAgents(text: string) {
        return this.http.post<any>(`${environment.api.url}agents/search`, {text: text});
    }
    searchCustomsAgents(text: string) {
        return this.http.post<any>(`${environment.api.url}customs-agents/search`, {text: text});
    }
    searchAirlines(text: string) {
        return this.http.post<any>(`${environment.api.url}airlines/search`, {text: text});
    }
    searchBoats(text: string) {
        return this.http.post<any>(`${environment.api.url}boats/search`, {text: text});
    }
    searchConcepts(text: string) {
        return this.http.post<any>(`${environment.api.url}concepts/search`, {text: text});
    }
    searchCities(text: string, via: number) {
        return this.http.post<any>(`${environment.api.url}cities/search`, {text: text, via: via});
    }
    searchTerminals(text: string) {
        return this.http.post<any>(`${environment.api.url}terminals/search`, {text: text});
    }
    searchPort(text: string, port: number) {
        return this.http.post<any>(`${environment.api.url}ports/search`, {text: text, port: port})
            .pipe(response => {
                return response;
            });
    }
}