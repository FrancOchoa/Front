import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class QuoteCommentService {
    protected url = `${environment.api.url}quote/comments`;

    constructor(private http: HttpClient) {}

    save(formData) {
        return this.http.post(`${this.url}`, formData);
    }

    update(id: number, formData) {
        return this.http.put(`${this.url}/${id}`, formData);
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }
}