import {Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {PortService} from '../../../../../services/autocomplete/PortService';
import {Loadding} from '../../../../../utils/Loading';
import {Port} from '../../../../../models/commercial/quote/Port';
import {TypeaheadMatch} from 'ngx-bootstrap/typeahead';
import {Flete} from '../../../../../models/commercial/tarifario/Flete';
import {AutocompleteService} from '../../../../../services/Autocomplete';
import {Select} from '../../../../../models/Select';
import {FleteService} from '../../../../../services/commercial/tarifario/FleteService';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsModalRef, BsModalService, PageChangedEvent} from 'ngx-bootstrap';
import {Tarifa} from '../../../../../models/commercial/tarifario/Tarifa';
import {Recargo} from '../../../../../models/commercial/tarifario/Recargo';
import {ConceptService} from '../../../../../services/autocomplete/concept.service';
import {TarifaService} from '../../../../../services/commercial/tarifario/TarifaService';
import {RecargoService} from '../../../../../services/commercial/tarifario/RecargoService';
import {TransporteTerrestre} from '../../../../../models/commercial/tarifario/TransporteTerrestre';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-flete',
    templateUrl: './flete.component.html',
    styleUrls: ['./flete.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FleteComponent implements OnInit {
    private elementLoading;
    private specialKeys: Array<string> = [
        ' ', 'Escape', 'Tab', 'End', 'Home', 'Enter', 'F5', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control'
    ];
    private textSearch: string;
    private searchDestination = false;
    private portOriginCode = 0;
    private index = 0;
    registering = true;
    search_text = '';
    total_registers: number;
    via_id = 1;
    service_type_id: any = '';
    title = 'AÉREO';
    portOrigin: Port;
    portDestination: Port;
    searchPorts: Observable<any>;
    searchAgent: Observable<any>;
    searchTransport: Observable<any>;
    searchConcepts: Observable<any>;
    flete: Flete = new Flete();
    cargas: Array<Select>;
    currencies: Array<Select>;
    factors: Array<Select>;
    bsRangeValue: Date[];
    conditions: string = null;
    observations: string = null;
    modalRef: BsModalRef;
    vias: Array<Select>;
    services_types: Array<Select>;
    fletes: Array<Flete> = [];

    dataPager: Array<any> = [];

    tarifas: Array<Tarifa> = [];
    recargos: Array<Recargo> = [];

    select: Select;
    fs = 0;
    sc = 0;

    constructor(
        private modalService: BsModalService,
        private portService: PortService,
        private autocompleteService: AutocompleteService,
        private fleteService: FleteService,
        private conceptService: ConceptService,
        private tarifaService: TarifaService,
        private recargoService: RecargoService,
    ) {
        defineLocale('es', esLocale);

        this.searchPorts = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                const port = this.searchDestination ? this.portOriginCode : 0;
                this.portService.search(this.textSearch, port)
                    .subscribe((response: any) => {
                        Loadding.hideInInput(this.elementLoading);
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });

        this.searchAgent = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.autocompleteService.searchAgents(this.textSearch)
                    .subscribe((response: any) => {
                        Loadding.hideInInput(this.elementLoading);
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });

        this.searchTransport = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                if ( this.via_id === 1) {
                    this.autocompleteService.searchAirlines(this.textSearch)
                        .subscribe((response: any) => {
                            Loadding.hideInInput(this.elementLoading);
                            if (response.status && response.data.length > 0)
                                observer.next(response.data);
                        });
                } else {
                    if (this.service_type_id === 1) {
                        this.autocompleteService.searchBoats(this.textSearch)
                            .subscribe((response: any) => {
                                Loadding.hideInInput(this.elementLoading);
                                if (response.status && response.data.length > 0)
                                    observer.next(response.data);
                            });
                    } else {
                        this.autocompleteService.searchAgents(this.textSearch)
                            .subscribe((response: any) => {
                                Loadding.hideInInput(this.elementLoading);
                                if (response.status && response.data.length > 0)
                                    observer.next(response.data);
                            });
                    }
                }
            }
        });

        this.searchConcepts = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.conceptService.search(this.textSearch)
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
        this.portOrigin = new Port();
        this.portDestination = new Port();
        this.fleteService.chargeSelects().subscribe(response => {
            this.services_types = response.data.services_types;
            this.currencies     = response.data.currencies;
            this.factors       = response.data.factors;
            this.cargas         = response.data.product_types;
            this.vias           = response.data.vias;
            this.search();
        });
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

        if (event.target.id === 'search-origin') {
            this.searchDestination = false;
        }
        if (event.target.id === 'search-destination') {
            this.searchDestination = true;
        }
    }

    onSelect(event: TypeaheadMatch, type: number, index: number = 0): void {
        switch (type) {
            case 1:
                this.portOrigin = event.item;
                break;
            case 2:
                this.portDestination = event.item;
                break;
            case 3:
                this.dataPager[index].agent = event.item;
                this.dataPager[index].agent_id = event.item.code;
                break;
            case 4:
                this.dataPager[index].transport = event.item;
                this.dataPager[index].transport_id = event.item.code;
                break;
        }
    }

    pageChanged(event: PageChangedEvent): void {
        this.search(event.page);
    }

    addRow(_table: string = 'tbl_flete') {
        switch (_table) {
            case 'tbl_tarifa':
                this.tarifas.push(new Tarifa('', ''));
                break;
            case 'tbl_recargos':
                this.recargos.push(new Recargo());
                break;
            default:
                const obj: any = new Flete();
                obj.edit = true;
                if (!this.registering) {
                    this.registering = true;
                    this.dataPager = [];
                }
                this.dataPager.unshift(obj);
                break;
        }
    }

    deleteRow(index: number, table: string = 'tbl_flete') {
        switch (table) {
            case 'tbl_tarifa':
                this.tarifas.splice(index, 1);
                break;
            case 'tbl_recargos':
                this.recargos.splice(index, 1);
                break;
            default:
                this.dataPager.splice(index, 1);
                break;
        }
    }

    editRow(index: number, table: number = 0) {
        this.dataPager[index].date_range = [
            new Date(this.dataPager[index].date_start + ' 00:00:00'),
            new Date(this.dataPager[index].date_end  + ' 00:00:00')
        ];
        this.dataPager[index].edit = true;
    }

    cloneRow(index: number) {
        console.log(this.dataPager[index]);
        const obj: any = Object.assign(new Flete(), this.dataPager[index]);
        obj.id = 0;
        obj.edit = true;
        obj.agent = Object.assign(new Select(), this.dataPager[index].agent);
        obj.transport = Object.assign(new Select(), this.dataPager[index].transport);
        obj.recargos = [];
        obj.tarifas = [];
        this.dataPager[index].recargos.map(function (r: Recargo) {
            const recargo = Object.assign(new Recargo(), r);
            obj.recargos.push(recargo);
        });
        this.dataPager[index].tarifas.map(function (t: Tarifa) {
            const tarifa = Object.assign(new Tarifa(''), t);
            obj.tarifas.push(tarifa);
        });

        if (typeof obj.date_start === 'string' || typeof obj.date_end === 'string') {
            obj.date_range = [
                new Date(obj.date_start + ' 00:00:00'),
                new Date(obj.date_end  + ' 00:00:00')
            ];
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
            port_origin_id   : this.portOrigin.port,
            country_origin_id: this.portOrigin.country,
            port_destination_id   : this.portDestination.port,
            country_destination_id: this.portDestination.country,
            service_type_id: this.service_type_id,
            via_id: this.via_id,
            data  : this.dataPager,
        };
        this.fleteService.save(data).subscribe((response: any) => {
            if (response.status) {
                this.registering = false;
                this.total_registers = response.data.total;
                this.dataPager = response.data.data;
            }
        });
    }

    update(index: number, _data: any = null) {
        Loadding.showUpdate();
        let data = Object.assign(new Flete(), this.dataPager[index]);
        if (_data) { data = _data; }
        const id = this.dataPager[index].id;
        this.fleteService.update(id, data).subscribe((response: any) => {
            if (response.status) {
                this.dataPager[index].edit = false;
                const i = this.fletes.findIndex( x => x.id === id);
                data.agent = Object.assign(new Select(), this.dataPager[index].agent);
                data.transport = Object.assign(new Select(), this.dataPager[index].transport);
                this.fletes[i] = data;

                this.closeModal();
            }
        });
    }

    delete(id: number, index: number, table: string = 'tbl_flete') {
        switch (table) {
            case 'tbl_tarifa':
                console.log('tbl_tarifas');
                break;
            case 'tbl_recargos':
                Loadding.showDelete(function () {
                    this.recargoService.delete(id).subscribe((response: any) => {
                        if (response.status) {
                            this.recargos.splice(index, 1);
                        }
                    });
                }.bind(this));
                break;
            default:
                Loadding.showDelete(function () {
                    this.fleteService.delete(id).subscribe((response: any) => {
                        if (response.status) {
                            this.dataPager.splice(index, 1);
                            this.total_registers--;
                        }
                    });
                }.bind(this));
                break;
        }
    }

    findInArray(array: Array<Select>, code) {
        return array.find(x => Number(x.code) === Number(code)).description;
    }

    cancelEdition() {
        this.dataPager[this.index] = this.fletes[this.index];
        this.dataPager[this.index].edit = false;
    }

    initTarifas() {
        if (this.via_id === 1) {
            this.tarifas.push(new Tarifa(0));
            this.tarifas.push(new Tarifa(45, '+ 45 Kgs', '+'));
            this.tarifas.push(new Tarifa(100, '+ 100 Kgs', '+'));
            this.tarifas.push(new Tarifa(300, '+ 300 Kgs', '+'));
            this.tarifas.push(new Tarifa(500, '+ 500 Kgs', '+'));
            this.tarifas.push(new Tarifa(1000, '+ 1000 Kgs', '+'));
        } else {
            if (Number(this.service_type_id) === 2) {
                this.tarifas.push(new Tarifa(0));
                this.tarifas.push(new Tarifa(0, 'w/m'));
                this.tarifas.push(new Tarifa(10, '+ 10 cbm', '+'));
            } else {
                this.factors.map(function (item: Select) {
                    if ((item.code >= 25 && item.code <= 29) || (item.code >= 53 && item.code <= 57)) {
                        this.tarifas.push(new Tarifa(item.code, item.description));
                    }
                }, this);
            }
        }
    }

    openModal(template: TemplateRef<any>, index: number, id_row: number, name_modal: string) {
        this.index = index;
        this.tarifas = [];
        this.recargos = [];

        switch (name_modal) {
            case 'tarifas':
                if (id_row > 0) {
                    Loadding.showSearch();
                    this.tarifaService.search({model_name: 'Flete', model_id: id_row}).subscribe((response: any) => {
                        if (response.status) {
                            if (response.data.length > 0) {
                                this.tarifas = response.data;
                            } else {
                                this.initTarifas();
                            }
                        }
                        this.modalRef = this.modalService.show(template, { keyboard: false, ignoreBackdropClick: true });
                        Loadding.close();
                    });
                } else {
                    if (this.dataPager[this.index].tarifas.length > 0) {
                        this.tarifas = this.dataPager[this.index].tarifas;
                    } else {
                        this.initTarifas();
                    }
                    this.modalRef = this.modalService.show(template, { keyboard: false, ignoreBackdropClick: true });
                }
                break;
            case 'recargos':
                if (id_row > 0) {
                    Loadding.showSearch();
                    this.recargoService.search({model_name: 'Flete', model_id: id_row}).subscribe((response: any) => {
                        if (response.data.length > 0) {
                            this.recargos = response.data;
                        }
                        this.modalRef = this.modalService.show(template, {keyboard: false, ignoreBackdropClick: true});
                        Loadding.close();
                    });
                } else {
                    if (this.dataPager[this.index].recargos.length > 0) {
                        this.recargos = this.dataPager[this.index].recargos;
                    }
                    this.modalRef = this.modalService.show(template, { keyboard: false, ignoreBackdropClick: true });
                }
                break;
            default:
                this.modalRef = this.modalService.show(template, { keyboard: false, ignoreBackdropClick: true });
                break;
        }
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
        this.fleteService.paginate(page, this.search_text, this.via_id, this.service_type_id).subscribe((resp: any) => {
            this.total_registers = resp.total;
            this.fletes = resp.data;
            this.dataPager = this.fletes.map(function (x: Flete) {
                const flete: any = Object.assign(new Flete(), x);
                flete.agent = Object.assign(new Select(), x.agent);
                flete.transport = Object.assign(new Select(), x.transport);
                flete.edit = false;
                return flete;
            });
            this.registering = false;
            Loadding.close();
        });
    }

    saveTarifas() {
        if (this.dataPager[this.index].id > 0) {
            Loadding.showCreate();
            const data = {
                model_id: this.dataPager[this.index].id,
                model_name: 'Flete',
                tarifas: this.tarifas
            };
            this.tarifaService.save(data).subscribe((response: any) => {
                if (response.status) {
                    this.closeModal();
                }
            });
        } else {
            this.dataPager[this.index].tarifas = this.tarifas;
            this.closeModal();
        }
    }

    saveRecargos() {
        if (this.dataPager[this.index].id > 0) {
            Loadding.showCreate();
            const data = {
                model_id: this.dataPager[this.index].id,
                model_name: 'Flete',
                recargos: this.recargos
            };
            this.recargoService.save(data).subscribe((response: any) => {
                if (response.status) {
                    this.closeModal();
                }
            });
        } else {
            this.dataPager[this.index].recargos = this.recargos;
            this.closeModal();
        }
    }

    selectVia() {
        this.dataPager = [];
        this.tarifas = [];
        this.recargos = [];
        this.addRow();

        this.title = this.vias[Number(this.via_id) - 1].description;
        if (Number(this.via_id) === 1) {
            this.service_type_id = '';
        } else {
            this.service_type_id = 1;
        }
    }

    selectServiceType() {
        this.dataPager = [];
        this.tarifas = [];
        this.recargos = [];
        this.addRow();
    }

    _setDate(index: number) {
        this.bsRangeValue = this.dataPager[index].date_range;
        if (this.bsRangeValue && this.bsRangeValue.length === 2) {
            const dateStart = this.bsRangeValue[0].toDateString();
            const dateEnd = this.bsRangeValue[1].toDateString();
            this.dataPager[index].date_start = dateStart;
            this.dataPager[index].date_end = dateEnd;
        } else {
            this.bsRangeValue = [];
            this.dataPager[index].date_start = null;
            this.dataPager[index].date_end = null;
        }
    }
}
