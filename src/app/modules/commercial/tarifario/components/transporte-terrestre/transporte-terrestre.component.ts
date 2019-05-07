import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {BsModalRef, BsModalService, defineLocale, esLocale, PageChangedEvent, TypeaheadMatch} from 'ngx-bootstrap';
import {AutocompleteService} from '../../../../../services/Autocomplete';
import {Loadding} from '../../../../../utils/Loading';
import {Select} from '../../../../../models/Select';
import {Port} from '../../../../../models/commercial/quote/Port';
import {TransporteTerrestreService} from '../../../../../services/commercial/tarifario/TransporteTerrestreService';
import {GastoLocal} from '../../../../../models/commercial/tarifario/GastoLocal';
import {TransporteTerrestre} from '../../../../../models/commercial/tarifario/TransporteTerrestre';
import {Flete} from '../../../../../models/commercial/tarifario/Flete';
import {Tarifa} from '../../../../../models/commercial/tarifario/Tarifa';
import {Recargo} from '../../../../../models/commercial/tarifario/Recargo';
import {TarifaService} from '../../../../../services/commercial/tarifario/TarifaService';
import {RecargoService} from '../../../../../services/commercial/tarifario/RecargoService';

@Component({
    selector: 'app-transporte-terrestre',
    templateUrl: './transporte-terrestre.component.html',
    styleUrls: ['./transporte-terrestre.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransporteTerrestreComponent implements OnInit {
    private specialKeys: Array<string> = [
        ' ', 'Escape', 'Tab', 'End', 'Home', 'Enter', 'F5', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control'
    ];
    private textSearch: string;
    private elementLoading;
    private index = 0;
    private searchDestination = false;
    private portOriginCode = 0;
    registering = false;
    zonas: any;
    search_text = '';
    total_registers: number;
    searchPorts: Observable<any>;
    location = 'Local';
    load = 'Suelta';
    currencies: Array<Select>;
    type_charge: Array<Select>;
    data: Array<TransporteTerrestre> = [];
    dataPager: Array<any> = [];
    searchProvider: Observable<any>;
    modalRef: BsModalRef;
    tarifas: Array<Tarifa> = [];
    recargos: Array<Recargo> = [];
    factors: Array<Select>;

    constructor(
        private modalService: BsModalService,
        private autocompleteService: AutocompleteService,
        private transporteTerrestreService: TransporteTerrestreService,
        private tarifaService: TarifaService,
        private recargoService: RecargoService,
    ) {
        defineLocale('es', esLocale);

        this.searchPorts = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                const port = this.searchDestination ? this.portOriginCode : 0;
                this.autocompleteService.searchPort(this.textSearch, port)
                    .subscribe((response: any) => {
                        Loadding.hideInInput(this.elementLoading);
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });

        this.searchProvider = Observable.create((observer: any) => {
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
        this.transporteTerrestreService.chargeSelects().subscribe(response => {
            this.currencies = response.data.currencies;
            this.type_charge = response.data.product_types;
            this.factors = response.data.factors;
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
                this.dataPager[index].provider = event.item;
                this.dataPager[index].provider_id = event.item.code;
                break;
            case 2:
                this.dataPager[index].origin = event.item;
                this.dataPager[index].port_origin_id = event.item.port;
                this.dataPager[index].country_origin_id = event.item.country;
                this.portOriginCode = event.item.port;
                break;
            case 3:
                this.dataPager[index].destination = event.item;
                this.dataPager[index].port_destination_id = event.item.port;
                this.dataPager[index].country_destination_id = event.item.country;
                break;
        }
        console.log(this.dataPager[index]);
    }

    pageChanged(event: PageChangedEvent): void {
        this.search(event.page);
    }

    addRow(table = 'tbl_transport') {
        if (table === 'tbl_transport') {
            const obj: any = new TransporteTerrestre();
            obj.edit = true;
            if (!this.registering) {
                this.registering = true;
                this.dataPager = [];
            }
            this.dataPager.unshift(obj);
        } else if (table === 'tbl_tarifa') {
            this.tarifas.push(new Tarifa('', ''));
        } else {
            this.recargos.push(new Recargo());
        }
    }

    deleteRow(index: number, table = 'tbl_transport') {
        if (table === 'tbl_transport') {
            this.dataPager.splice(index, 1);
        } else if (table === 'tbl_tarifa') {
            this.tarifas.splice(index, 1);
        } else {
            this.recargos.splice(index, 1);
        }
    }

    editRow(index: number) {
        this.index = index;
        if (this.dataPager[index].date_end) {
            this.dataPager[index].date_range = [
                new Date(this.dataPager[index].date_start + ' 00:00:00'),
                new Date(this.dataPager[index].date_end  + ' 00:00:00')
            ];
        } else {
            this.dataPager[index].date_start = new Date(this.dataPager[index].date_start + ' 00:00:00');
        }
        this.dataPager[index].edit = true;
    }

    cloneRow(index: number) {
        const obj: any = Object.assign(new TransporteTerrestre(), this.dataPager[index]);
        obj.id = 0;
        obj.origin = Object.assign(new Port(), this.dataPager[index].origin);
        obj.destination = Object.assign(new Port(), this.dataPager[index].destination);
        obj.provider = Object.assign(new Select(), this.dataPager[index].provider);
        obj.edit = true;
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

        if (!this.registering) {
            this.registering = true;
            this.dataPager = [];
        }

        if (obj.date_end) {
            if (typeof obj.date_start === 'string' || typeof obj.date_end === 'string') {
                obj.date_range = [
                    new Date(obj.date_start + ' 00:00:00'),
                    new Date(obj.date_end  + ' 00:00:00')
                ];
            }
        } else {
            if (typeof obj.date_start === 'string') {
                obj.date_start = new Date(obj.date_start + ' 00:00:00');
            }
        }
        this.dataPager.unshift(obj);
    }

    save() {
        Loadding.showCreate();
        const data: any = {
            data  : this.dataPager,
            load: this.load,
            location: this.location,
        };

        this.transporteTerrestreService.save(data).subscribe((response: any) => {
            if (response.status) {
                this.registering = false;
                this.total_registers = response.data.total;
                this.dataPager = response.data.data;
            }
        });
    }

    update(index: number, _data: any = null) {
        Loadding.showUpdate();
        let data = Object.assign(new TransporteTerrestre(), this.dataPager[index]);
        if (_data) { data = _data; }
        const id = this.dataPager[index].id;
        this.transporteTerrestreService.update(id, data).subscribe((response: any) => {
            if (response.status) {
                this.dataPager[index].edit = false;
                this.closeModal();
            }
        });
    }

    delete(id: number, index: number, table = 'tbl_transport') {
        if (table === 'tbl_recargos') {
            Loadding.showDelete(function () {
                this.recargoService.delete(id).subscribe((response: any) => {
                    if (response.status) {
                        this.recargos.splice(index, 1);
                    }
                });
            }.bind(this));
        } else if (table === 'table_tarifa') {
            console.log('');
        } else {
            Loadding.showDelete(function () {
                this.transporteTerrestreService.delete(id).subscribe((response: any) => {
                    if (response.status) {
                        this.dataPager.splice(index, 1);
                        this.total_registers--;
                    }
                });
            }.bind(this));
        }
    }

    findInArray(array: Array<Select>, code: number) {
        return array.find(x => Number(x.code) === Number(code)).description;
    }

    cancelEdition() {
        this.dataPager[this.index] = this.data[this.index];
        this.dataPager[this.index].edit = false;
    }

    initTarifas() {
        if ((this.location === 'Local' && this.load === 'Suelta') ||
            (this.location === 'Nacional' && this.load === 'Suelta')) {
            this.tarifas.push(new Tarifa(0, 'MINIMO'));
            this.tarifas.push(new Tarifa(45, '+ 45 Kgs', '+'));
            this.tarifas.push(new Tarifa(100, '+ 100 Kgs', '+'));
            this.tarifas.push(new Tarifa(300, '+ 300 Kgs', '+'));
            this.tarifas.push(new Tarifa(500, '+ 500 Kgs', '+'));
            this.tarifas.push(new Tarifa(1000, '+ 1000 Kgs', '+'));
        } else if ((this.location === 'Local' && this.load === 'Contenedor/Plataforma') ||
            (this.location === 'Nacional' && this.load === 'Contenedor/Plataforma')) {
            this.tarifas.push(new Tarifa('CONTENEDOR 20', 'CONTENEDOR 20'));
            this.tarifas.push(new Tarifa('PLATAFORMA 20', 'PLATAFORMA 20'));
            this.tarifas.push(new Tarifa('CONTENEDOR 40', 'CONTENEDOR 40'));
            this.tarifas.push(new Tarifa('PLATAFORMA 40', 'PLATAFORMA 40'));
        }
    }

    openModal(template: TemplateRef<any>, index: number, id_row: number, name_modal: string) {
        this.index = index;
        this.tarifas = [];
        this.recargos = [];
        switch (name_modal) {
            case 'tarifas':
                this.zonas = this.dataPager[index].zonas;
                if (typeof this.dataPager[index].zonas === 'string') {
                    this.zonas = JSON.parse(this.dataPager[index].zonas);
                }
                if (id_row > 0) {
                    Loadding.showSearch();
                    this.tarifaService.search({model_name: 'TransporteTerrestre', model_id: id_row}).subscribe((response: any) => {
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
                    this.recargoService.search({model_name: 'TransporteTerrestre', model_id: id_row}).subscribe((response: any) => {
                        if (response.status) {
                            this.recargos = response.data;
                        }
                        this.modalRef = this.modalService.show(template, { keyboard: false, ignoreBackdropClick: true });
                        Loadding.close();
                    });
                } else {
                    if (this.dataPager[this.index].recargos.length > 0) {
                        this.recargos = this.dataPager[this.index].recargos;
                    }
                    this.modalRef = this.modalService.show(template, { keyboard: false, ignoreBackdropClick: true });
                }
                break;
            case 'observations':
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
        this.transporteTerrestreService.paginate(page, this.search_text, this.location, this.load).subscribe((resp: any) => {
            this.total_registers = resp.total;
            this.data = resp.data;
            this.dataPager = this.data.map(function (x: TransporteTerrestre) {
                const tt: any = Object.assign(new TransporteTerrestre(), x);
                tt.origin = Object.assign(new Port(), x.origin);
                tt.destination = Object.assign(new Port(), x.destination);
                tt.provider = Object.assign(new Port(), x.provider);
                tt.edit = false;
                return tt;
            });
            this.registering = false;
            Loadding.close();
        });
    }

    saveTarifas() {
        if (this.dataPager[this.index].id > 0) {
            Loadding.showCreate();
            const data = {
                model_id: this.data[this.index].id,
                model_name: 'TransporteTerrestre',
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
                model_id: this.data[this.index].id,
                model_name: 'TransporteTerrestre',
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

    editZonas(index: number) {
        this.zonas[index].edit = false;
        if (this.dataPager[this.index].id > 0) {
            this.update(this.index, {zonas: this.zonas});
        }
        this.dataPager[this.index].zonas = this.zonas;
    }
}
