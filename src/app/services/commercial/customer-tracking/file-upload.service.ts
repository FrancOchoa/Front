import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor(private http: HttpClient) { }
    upload(formData) {
        return this.http.post<any>(`${environment.api.url}base/upload-file`, formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => this.getEventMessage(event)),
            catchError(this.handleError)
        );
    }

    uploadBase(formData) {
        return this.http.post<any>(`${environment.domain}files`, formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => this.getEventMessage(event)),
            catchError(this.handleError)
        );
    }

    delete(id: number) {
        return this.http.delete(`${environment.domain}files/${id}`);
    }

    private getEventMessage(event: HttpEvent<any>) {
        switch (event.type) {
            case HttpEventType.UploadProgress:
                return this.fileUploadProgress(event);
            case HttpEventType.Response:
                return this.apiResponse(event);
            default:
                console.log(event.type);
        }
    }
    private fileUploadProgress(event) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        return { status: 'progress', message: percentDone, data: null };
    }
    private apiResponse(event) {
        return {status: 'finish', message: 0, data: event.body};
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('Error', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` +  `body was: ${error.error}`);
        }
        return throwError('Something bad happened. Please try again later.');
    }
}
