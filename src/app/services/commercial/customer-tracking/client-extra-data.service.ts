import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {ClientExtraData} from '../../../models/commercial/customer-tracking/ClientExtraData';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Customer} from '../../../models/commercial/customer-tracking/Customer';

@Injectable({ providedIn: 'root' })
export class ClientExtraDataService {
	public extraDataSource = new Subject<Customer>();
	public updateExtraDataSubject = new Subject<ClientExtraData>();

	constructor(private http: HttpClient) { }

	passExtraData(customer: Customer) {
		this.extraDataSource.next(customer);
	}

	updateExtraData(extraData: ClientExtraData) {
		this.updateExtraDataSubject.next(extraData);
	}

	save(extraData: ClientExtraData) {
		return this.http.post<any>(`${environment.api.url}commercial/customer-tracking/client-extra-data`, extraData)
			.pipe(map(response => {
					return response;
				})
			);
	}
}
