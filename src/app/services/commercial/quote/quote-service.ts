import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class QuoteService {
    constructor(private http: HttpClient) {}

    getDataInit() {
        const data = {params: {company_id: environment.user.company}};
        return this.http.get(`${environment.api.url}quotes/create`, data)
            .pipe(response => {
                return response;
            });
    }
    save(formData: FormData) {
        return this.http.post(`${environment.api.url}quotes`, formData);
    }

    searchByCode(code: string) {
        return this.http.get(`${environment.api.url}quotes/${code}`);
    }

    getComments(id: number) {
        return this.http.get(`${environment.api.url}quote/${id}/comments`);
    }

    edit() {}

    update() {}

    delete() {}

    /** SISTEMA ANTIGUO **/

    generatePDF(id: number) {
        const formData: any = new FormData();
        formData.append('module', 'mdlCreatePDFView');
        formData.append('id', id);
        formData.append('option', 1);
        return this.http.post('http://10.109.106.2/AccionaFWD/modulo/comercial/cotizacion_plantilla/php/BL_principal.php', formData)
            .pipe(map(response => {
                return response[0];
        }));
    }

    updateState(id: number, state: number, rpta: number) {
        const formData: any = new FormData();
        formData.append('module', 'mdlUpdRptaCotizacion');
        formData.append('id', id);
        formData.append('estado', state);
        formData.append('rpta', rpta);
        return this.http.post('http://10.109.106.2/AccionaFWD/modulo/comercial/cotizacion_plantilla/php/BL_principal.php', formData)
            .pipe(map(response => {
                return response[0];
            }));
    }

    _delete(quote_id: number, detail_id: number) {
        const formData: any = new FormData();
        formData.append('module', 'mdlupdanulCot');
        formData.append('scotid', quote_id);
        formData.append('sdetid', detail_id);
        return this.http.post('http://10.109.106.2/AccionaFWD/modulo/comercial/cotizacion_plantilla/php/BL_principal.php', formData)
            .pipe(map(response => {
                return response[0];
            }));
    }
}