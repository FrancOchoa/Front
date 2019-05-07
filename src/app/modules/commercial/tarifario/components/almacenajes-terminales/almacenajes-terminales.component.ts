import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {Select} from '../../../../../models/Select';
import {Observable} from 'rxjs';
import {BsModalRef, BsModalService, defineLocale, esLocale, PageChangedEvent, TypeaheadMatch} from 'ngx-bootstrap';
import {AutocompleteService} from '../../../../../services/Autocomplete';
import {StorageTerminalsService} from '../../../../../services/commercial/tarifario/StorageTerminalsService';
import {Loadding} from '../../../../../utils/Loading';
import {AlmacenTerminal} from '../../../../../models/commercial/tarifario/AlmacenTerminal';

@Component({
    selector: 'app-almacenajes-terminales',
    templateUrl: './almacenajes-terminales.component.html',
    styleUrls: ['./almacenajes-terminales.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AlmacenajesTerminalesComponent implements OnInit {
    private specialKeys: Array<string> = [
        ' ', 'Escape', 'Tab', 'End', 'Home', 'Enter', 'F5', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control'
    ];
    private textSearch: string;
    private elementLoading;
    private index = 0;
    registering = false;
    search_text: any;
    total_registers: number;
    currencies: Array<Select>;
    factors: Array<Select>;
    vias: Array<Select>;
    searchStorageTerminals: Observable<any>;
    searchCity: Observable<any>;
    data: Array<AlmacenTerminal> = [];
    dataPager: Array<any> = [];
    modalRef: BsModalRef;

    constructor(
        private modalService: BsModalService,
        private autocompleteService: AutocompleteService,
        private storageTerninalsService: StorageTerminalsService
    ) {
        defineLocale('es', esLocale);

        this.searchStorageTerminals = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.autocompleteService.searchTerminals(this.textSearch)
                    .subscribe((response: any ) => {
                        Loadding.hideInInput(this.elementLoading);
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });

        this.searchCity = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.autocompleteService.searchCities(this.textSearch, this.dataPager[this.index].via_id)
                    .subscribe((response: any ) => {
                        Loadding.hideInInput(this.elementLoading);
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });
    }

    ngOnInit() {
        Loadding.show();
        this.storageTerninalsService.chargeSelects().subscribe(response => {
            this.currencies = response.data.currencies;
            this.factors    = response.data.factors;
            this.vias       = response.data.vias;

            this.search();
        });
    }

    setTextSearch(event: any, index: number = 0): void {
        if (this.specialKeys.indexOf(event.key) !== -1) { return; }

        this.textSearch = event.target.value;
        this.elementLoading = event.target.nextSibling;
        this.index = index;

        if (this.textSearch.length > 0) {
            Loadding.showInInput(this.elementLoading);
        } else {
            Loadding.hideInInput(this.elementLoading);
        }
    }

    onSelect(event: TypeaheadMatch, type: number, index: number = 0): void {
        switch (type) {
            case 1:
                this.dataPager[index].terminal = event.item;
                this.dataPager[index].terminal_id = event.item.code;
                break;
            case 2:
                this.dataPager[index].city    = event.item;
                this.dataPager[index].city_id = event.item.code;
                break;
        }
    }

    pageChanged(event: PageChangedEvent): void {
        this.search(event.page);
    }

    addRow() {
        const obj: any = new AlmacenTerminal();
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
        const obj: any = Object.assign(new AlmacenTerminal(), this.dataPager[index]);
        obj.id = 0;
        obj.terminal = Object.assign(new Select(), this.dataPager[index].terminal);
        obj.city = Object.assign(new Select(), this.dataPager[index].city);
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

    save() {
        Loadding.showCreate();
        const data: any = {
            data  : this.dataPager,
        };

        this.storageTerninalsService.save(data).subscribe((response: any) => {
            if (response.status) {
                this.registering = false;
                this.total_registers = response.data.total;
                this.dataPager = response.data.data;
            }
        });
    }

    update(index: number, _data: any = null) {
        Loadding.showUpdate();
        let data = Object.assign(new AlmacenTerminal(), this.dataPager[index]);
        if (_data) { data = _data; }
        const id = this.dataPager[index].id;
        this.storageTerninalsService.update(id, data).subscribe((response: any) => {
            if (response.status) {
                this.dataPager[index].edit = false;
                this.closeModal();
            }
        });
    }

    delete(id: number, index: number) {
        Loadding.showDelete(function () {
            this.storageTerninalsService.delete(id).subscribe((response: any) => {
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
        this.storageTerninalsService.paginate(page, this.search_text).subscribe((resp: any) => {
            this.total_registers = resp.total;
            this.dataPager = resp.data;
            this.data = resp.data;
            Loadding.close();
            this.registering = false;
        });
    }
}
