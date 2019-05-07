import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class CommercialTrackingService {
    constructor(private http: HttpClient) {}

    getData(user_id: number, commercial_id: number, dateRange: Date[]) {
        const request = {user_id: user_id, commercial_id: commercial_id, dateRange: dateRange};
        return this.http.post(`${environment.api.url}commercial/tracking`, request)
            .pipe(response => {
                return response;
            });
    }

    exportData(user_id: number, commercial_id: number, dateRange: Date[]) {
        const request = {user_id: user_id, commercial_id: commercial_id, dateRange: dateRange};
        return this.http.post(`${environment.api.url}commercial/tracking/export-excel`, request, { responseType: 'blob'});
    }
}