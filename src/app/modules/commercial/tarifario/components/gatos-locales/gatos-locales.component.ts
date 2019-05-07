import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {Port} from '../../../../../models/commercial/quote/Port';
import {Observable} from 'rxjs';
import {Loadding} from '../../../../../utils/Loading';
import {PortService} from '../../../../../services/autocomplete/PortService';
import {BsModalRef, BsModalService, PageChangedEvent, TypeaheadMatch} from 'ngx-bootstrap';
import {GastoLocal} from '../../../../../models/commercial/tarifario/GastoLocal';
import {Select} from '../../../../../models/Select';
import {AutocompleteService} from '../../../../../services/Autocomplete';
import {Concept} from '../../../../../models/autocomplete/Concept';
import {GastoLocalService} from '../../../../../services/commercial/tarifario/GastoLocalService';

@Component({
    selector: 'app-gatos-locales',
    templateUrl: './gatos-locales.component.html',
    styleUrls: ['./gatos-locales.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class GatosLocalesComponent implements OnInit {
    private specialKeys: Array<string> = [
        ' ', 'Escape', 'Tab', 'End', 'Home', 'Enter', 'F5', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control'
    ];
    private textSearch: string;
    private elementLoading;
    private index = 0;
    registering = true;
    search_text: any;
    total_registers: number;
    origin = true;
    currencies: Array<Select>;
    factors: Array<Select>;
    vias: Array<Select>;
    port: Port = new Port();
    concept: Concept = new Concept();
    searchPort: Observable<any>;
    searchAgenteProveedor: Observable<any>;
    data: Array<GastoLocal> = [];
    dataPager: Array<any> = [];
    modalRef: BsModalRef;

    constructor(
        private modalService: BsModalService,
        private autocompleteService: AutocompleteService,
        private gastoLocalService: GastoLocalService
    ) {
        defineLocale('es', esLocale);

        this.searchPort = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.autocompleteService.searchPort(this.textSearch, 0)
                    .subscribe((response: any) => {
                        Loadding.hideInInput(this.elementLoading);
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });

        this.searchAgenteProveedor = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.autocompleteService.searchAgents(this.textSearch)
                    .subscribe((response: any) => {
                        Loadding.hideInInput(this.elementLoading);
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });
    }

    ngOnInit() {
        Loadding.show();
        this.gastoLocalService.chargeSelects().subscribe(response => {
            this.currencies     = response.data.currencies;
            this.factors        = response.data.factors;
            this.vias           = response.data.vias;
            Loadding.close();
        });

        this.search();
    }

    setTextSearch(event: any): void {
        if (this.specialKeys.indexOf(event.key) !== -1) { return; }

        this.textSearch = event.target.value;
        this.elementLoading = event.target.nextSibling;

        if (this.textSearch.length > 0) {
            Loadding.showInInput(this.elementLoading);
        } else {
            Loadding.hideInInput(this.elementLoading);
        }
    }

    onSelect(event: TypeaheadMatch, type: number, index: number = 0): void {
        switch (type) {
            case 1:
                this.port = event.item;
                break;
            case 2:
                this.dataPager[index].provider = event.item;
                this.dataPager[index].agent_id = event.item.code;
                break;
            case 3:
                this.dataPager[index].concept    = event.item;
                this.dataPager[index].concept_id = event.item.code;
                break;
        }
    }

    pageChanged(event: PageChangedEvent): void {
        this.search(event.page);
    }

    addRow() {
        const obj: any = new GastoLocal();
        obj.edit = true;
        if (!this.registering) {
            this.registering = true;
            this.dataPager = [];
        }
        this.dataPager.unshift(obj);
    }

    deleteRow(index: number) {
        this.dataPager.splice(index, 1);
    }

    editRow(index: number) {
        this.dataPager[index].date = new Date(this.dataPager[index].date + ' 00:00:00');
        this.dataPager[index].edit = true;
    }

    cloneRow(index: number) {
        const obj: any = Object.assign(new GastoLocal(), this.dataPager[index]);
        obj.id = 0;
        obj.provider = Object.assign(new Select(), this.dataPager[index].provider);
        obj.edit = true;

        if (typeof this.dataPager[index].date === 'string') {
            obj.date = new Date(this.dataPager[index].date + ' 00:00:00');
        }

        if (!this.registering) {
            this.registering = true;
            this.dataPager = [];
        }

        this.dataPager.unshift(obj);
    }

    changeOrigin() {
        this.dataPager = [];
        this.port = new Port();
        this.addRow();
    }

    save() {
        Loadding.showCreate();
        const data: any = {
            is_origin : this.origin,
            port_id   : this.port.port,
            country_id: this.port.country,
            expenses  : this.dataPager,
        };

        this.gastoLocalService.save(data).subscribe((response: any) => {
            if (response.status) {
                this.registering = false;
                this.total_registers = response.data.total;
                this.dataPager = response.data.data;
            }
        });
    }

    update(index: number, _data: any = null) {
        Loadding.showUpdate();
        let data = Object.assign(new GastoLocal(), this.dataPager[index]);
        if (_data) { data = _data; }
        const id = this.dataPager[index].id;
        this.gastoLocalService.update(id, data).subscribe((response: any) => {
            if (response.status) {
                this.dataPager[index].edit = false;
                this.closeModal();
            }
        });
    }

    delete(id: number, index: number) {
        Loadding.showDelete(function () {
            this.gastoLocalService.delete(id).subscribe((response: any) => {
                if (response.status) {
                    this.dataPager.splice(index, 1);
                    this.total_registers--;
                }
            });
        }.bind(this));
    }

    findInArray(array: Array<Select>, code: number) {
        return array.find(x => x.code === Number(code)).description;
    }

    cancelEdition(index: number) {
        this.dataPager[index] = this.data[index];
        const new_date: Date = this.data[index].date;

        this.dataPager[index].date = [new_date.getFullYear(), new_date.getMonth() + 1, new_date.getDate()].join('-');
        this.dataPager[index].edit = false;
    }

    openModal(template: TemplateRef<any>, index: number) {
        this.index = index;
        this.modalRef = this.modalService.show(template, { keyboard: false, ignoreBackdropClick: true });
    }

    closeModal() {
        if (!this.modalRef) {
            return;
        }
        this.modalRef.hide();
        this.modalRef = null;
    }

    search(page: number = 1) {
        Loadding.show();
        this.gastoLocalService.paginate(page, this.search_text).subscribe((resp: any) => {
            this.total_registers = resp.total;
            this.dataPager = resp.data;
            this.data = resp.data;
            Loadding.close();
            this.registering = false;
        });
    }
}
