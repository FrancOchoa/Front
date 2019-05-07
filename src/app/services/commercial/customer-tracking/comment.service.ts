import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Comment } from '../../../models/commercial/customer-tracking/Comment';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
	public newCommentSubject = new Subject<any>();
	constructor(private http: HttpClient) { }
	
	addComment(comment: Comment) {
		this.newCommentSubject.next(comment);
	}
	
	getAllCommentsByCustomer(customer_id: number) {
		return this.http.get<any>(`${environment.api.url}commercial/customer-tracking/client/${customer_id}/comments`);
	}
	
	saveComment(comment: Comment) {
		return this.http.post<any>(`${environment.api.url}commercial/customer-tracking/comments`, comment)
			.pipe(map(response => {
					return response;
				})
			);
	}

	updateDateOrHour(comment_id: string, data: Object) {
		return this.http.patch<any>(`${environment.api.url}commercial/customer-tracking/comments/${comment_id}`, data);
	}
}
