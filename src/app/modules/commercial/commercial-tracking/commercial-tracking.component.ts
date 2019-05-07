import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import * as $ from 'jquery';
import 'datatables.net-bs4';
import {CommercialTrackingService} from '../../../services/commercial/quote/CommercialTrackingService';
import {Select} from '../../../models/Select';
import {CommercialService} from '../../../services/commercial/customer-tracking/commercial.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {dataTableOptions} from '../../../config/dataTableOptions';
import {AlertWithOptions, ConfirmAlert, Loadding} from '../../../utils/Loading';
import {QuoteCommentService} from '../../../services/commercial/quote/QuoteCommentService';
import {QuoteService} from '../../../services/commercial/quote/quote-service';
@Component({
    selector: 'app-commercial-tracking',
    templateUrl: './commercial-tracking.component.html',
    styleUrls: ['./commercial-tracking.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CommercialTrackingComponent implements OnInit  {
    @ViewChild('datatable') table;
    private dataTable: any;
    private comment_id: number;
    private quote_id: number;
    private edit = false;
    comment = '';
    comments: Array<any> = [];
    maxDate: Date;
    bsRangeValue: Date[];
    rows: Array<any> = [];
    commercials: Array<Select> = [];
    users: Array<Select> = [];
    user_id: any = '';
    commercial_id: any = '';
    observations = '';
    modalRef: BsModalRef;
    constructor(
        private modalService: BsModalService,
        private commercialTrackingService: CommercialTrackingService,
        private commercialService: CommercialService,
        private quoteService: QuoteService,
        private quoteCommentService: QuoteCommentService) { }

    ngOnInit() {
        this.maxDate = new Date();
        defineLocale('es', esLocale);
        this.searchData();
    }

    searchData() {
        Loadding.show();
        let dateStart: string;
        let dateEnd: string;
        const commercial_id = this.commercial_id === '' ? null : this.commercial_id;
        const user_id = this.user_id === '' ? null : this.user_id;
        if (this.bsRangeValue && this.bsRangeValue.length === 2) {
            dateStart = this.bsRangeValue[0].toDateString();
            dateEnd = this.bsRangeValue[1].toDateString();
        } else {
            const date = new Date();
            dateEnd = date.toDateString();
            date.setDate(date.getDate() - 60);
            dateStart = date.toDateString();
        }
        const dateRange = [new Date(dateStart), new Date(dateEnd)];
        this.commercialTrackingService.getData(user_id, commercial_id, dateRange).subscribe((response: any) => {
            if (response.status) {
                if (this.dataTable) {
                    this.dataTable.fnDestroy();
                    this.dataTable = null;
                }
                const data = response.data;
                this.users = data.users;
                this.commercials = data.commercials;
                this.rows = data.quotes;
            }
        }, error => {
            console.log(error);
        }, () => {
            setTimeout(() => {
                if (!this.dataTable) {
                    this.dataTable = $(this.table.nativeElement);
                    this.dataTable.dataTable(dataTableOptions);
                }
                Loadding.close();
            }, 0);
        });
    }

    exportData() {
        Loadding.show('Exportando Datos...');
        let dateStart: string;
        let dateEnd: string;
        const commercial_id = this.commercial_id === '' ? null : this.commercial_id;
        const user_id = this.user_id === '' ? null : this.user_id;
        if (this.bsRangeValue && this.bsRangeValue.length === 2) {
            dateStart = this.bsRangeValue[0].toDateString();
            dateEnd = this.bsRangeValue[1].toDateString();
        } else {
            const date = new Date();
            dateEnd = date.toDateString();
            date.setDate(date.getDate() - 30);
            dateStart = date.toDateString();
        }
        const dateRange = [new Date(dateStart), new Date(dateEnd)];
        this.commercialTrackingService.exportData(user_id, commercial_id, dateRange).subscribe((response: any) => {
            const blob = new Blob([response], {type: 'application/ms-excel'});
            const fileUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'seguimiento comercial.xlsx';
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            setTimeout(function () {
                window.URL.revokeObjectURL(fileUrl);
                link.remove();
            }, 100);
        }, error => {
            console.log(error);
        }, () => Loadding.close());
        this.bsRangeValue = [];
    }

    seeObservation(templateModal: TemplateRef<any>, text: string) {
        console.log(text);
        this.observations = text;
        this.modalRef = this.modalService.show(templateModal);
    }

    seeComments(templateModal: TemplateRef<any>, id: number) {
        this.quote_id = id;
        Loadding.show();
        this.quoteService.getComments(id).subscribe((response: any) => {
            if (response.status) {
                this.comments = response.data;
            }
            Loadding.close();
            this.modalRef = this.modalService.show(templateModal, {class: 'modal-lg', ignoreBackdropClick: true});
        });

    }

    saveComment() {
        if (!this.edit) {
            Loadding.showCreate();
            const data = {quote_id: this.quote_id, comment: this.comment};
            this.quoteCommentService.save(data).subscribe((response: any) => {
                if (response.status) {
                    this.comments.unshift(response.data);
                    this.comment = '';
                }
                Loadding.close();
            });
        } else {
            Loadding.showUpdate();
            const data = {comment: this.comment};
            this.quoteCommentService.update(this.comment_id, data).subscribe((response: any) => {
                if (response.status) {
                    const index = this.comments.findIndex( x => x.id === this.comment_id);
                    if (index > 0) {
                        this.comments[index].comment = this.comment;
                    }
                    this.comment = '';
                }
                Loadding.close();
                this.edit = false;
            });
        }
    }

    editComment(index: number) {
        this.edit = true;
        this.comment = this.comments[index].comment;
        this.comment_id = this.comments[index].id;
    }

    deleteComment(index: number, comment_id: number) {
        Loadding.showDelete(function () {
            this.quoteCommentService.delete(comment_id).subscribe((response: any) => {
                if (response.status) {
                    this.comments.splice(index, 1);
                }
            });
        }.bind(this));
    }

    viewPdf(id: number) {
        Loadding.show();
        this.quoteService.generatePDF(id).subscribe((response: any)  => {
            if (response.message === 'ok') {
                const content = response.contenido;
                const iframe = '<iframe width="100%" height="96%" src="data:application/pdf;base64,' + encodeURI(content) + '"></iframe>';
                const pdfWindow = window.open('', '_blank');
                pdfWindow.window.document.write(iframe);
                pdfWindow.window.document.title = response.file;
            }
            Loadding.close();
        });
    }

    editQuote(id: number) {
        const cw = `javascript:parent.Create_Pantalla("EDITAR PLANTILLA/COTIZACION","../modulo/comercial/cotizacion/editar.php?sId=${id}")`;
        const a = document.createElement('button');
        a.setAttribute('type', 'button');
        a.setAttribute('onclick', cw);
        a.click();
        a.remove();
    }

    approvedQuote(id: number, code: string, index: number) {
        ConfirmAlert.show(function () {
            this.quoteService.updateState(id, 1, 6).subscribe((response: any) => {
                if (response.message === 'ok') {
                    this.rows[index].v_est_cot = 1;
                }
                Loadding.close();
            });
        }.bind(this), 'Aprobación de cotización', `Está seguro de aprobar la cotización ${code}.`);
    }

    disapprovedQuote(id: number, code: string, index: number) {
        const inputOptions = {
            6: 'Costos elevados.',
            7: 'Presentación extemporanea de nuestra oferta.',
            8: 'Cancelación de la operación por parte del cliente.',
        };

        AlertWithOptions.show(function (rpta) {
            this.quoteService.updateState(id, 2, rpta).subscribe((response: any) => {
                if (response.message === 'ok') {
                    this.rows[index].v_est_cot = 2;
                    this.rows[index].v_obs_resp = inputOptions[rpta];
                }
                Loadding.close();
            });
        }.bind(this), 'Motivo de rechazo', inputOptions);
    }

    deleteQuote(quote_id: number, detail_id: number, index: number) {
        Loadding.showDelete(function () {
            this.quoteService._delete(quote_id, detail_id).subscribe((response: any) => {
                if (response.message === 'ok') {
                    this.rows.splice(index, 1);
                }
                Loadding.close();
            });
        }.bind(this));
    }
}
