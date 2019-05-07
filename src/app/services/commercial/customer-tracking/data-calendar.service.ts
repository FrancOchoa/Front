import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { Comment } from '../../../models/commercial/customer-tracking/Comment';
import {DataCalendar} from '../../../models/commercial/customer-tracking/DataCalendar';

@Injectable({ providedIn: 'root' })
export class DataCalendarService {
	public newDataCalendar = new Subject<any>();
	public showDataCalendarSubject = new Subject<any>();
	constructor(private http: HttpClient) {}
	getAllData(user_id: any) {
		return this.http.get<any>(`${environment.api.url}commercial/customer-tracking/user/${user_id}/comments`).pipe(
			map(response => {
				if (response.status) {
					return response.data;
				}
				return null;
			})
		)
	}
	addDataCalendar(comment: Comment) {
		this.newDataCalendar.next(comment);
	}
	showDataCalendar(dataCalendar: Array<DataCalendar>) {
		this.showDataCalendarSubject.next(dataCalendar);
	}
}
