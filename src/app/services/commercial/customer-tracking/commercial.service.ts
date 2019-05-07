import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CommercialService {
    constructor(private http: HttpClient) {}
    getByCompany() {
        const companyId = environment.user.company;
        return this.http.get(`${environment.api.url}company/${companyId}/commercials`)
            .pipe(map(response => {
                    return response;
                })
            );
    }
    exportData(rangeDate: Date[]) {
        return this.http.post(`${environment.api.url}commercial/customer-tracking/export`, rangeDate, { responseType: 'blob'});
    }
}
