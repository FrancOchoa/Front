import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {Case} from '../../../models/commercial/quote/Case';
import {ServiceQuote} from '../../../models/commercial/quote/ServiceQuote';
import {Tax} from '../../../models/commercial/quote/Tax';
import {Quote} from '../../../models/commercial/quote/Quote';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';
import {ConceptService} from '../../../services/autocomplete/concept.service';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {ClientService} from '../../../services/autocomplete/client.service';
import {PortService} from '../../../services/autocomplete/PortService';
import {Port} from '../../../models/commercial/quote/Port';
import {QuoteService} from '../../../services/commercial/quote/quote-service';
import {Select} from '../../../models/Select';
import {Concept} from '../../../models/autocomplete/Concept';
import {environment} from '../../../../environments/environment';
import {Utility} from '../../../utils/Utility';
import {Loadding} from '../../../utils/Loading';

@Component({
    selector: 'app-quote',
    templateUrl: './quote.component.html',
    styleUrls: ['./quote.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class QuoteComponent implements OnInit {
    private elementLoading;
    private colors: string[] = ['table-primary', 'table-success', 'table-warning', 'table-info', 'table-dark', 'table-danger'];
    private specialKeys: Array<string> = [
        ' ', 'Escape', 'Tab', 'End', 'Home', 'Enter', 'F5', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control'
    ];
    creating_group_international_transport = false;
    creating_group_expenses_at_origin = false;
    creating_group_expenses_at_destination = false;
    creating_group_additional_service = false;
    group_name: string = null;
    focus: Boolean = false;
    language = {'code': 'es', 'text': 'Español'};

    cases: Array<Case>;
    internationalTransports: Array<ServiceQuote>;
    expensesAtOrigin: Array<ServiceQuote>;
    expensesAtDestination: Array<ServiceQuote>;
    additionalServices: Array<ServiceQuote>;

    objectQuote: Quote;
    objectCase: Case;
    objectInternationalTransport: ServiceQuote;
    objectExpenseAtOrigin: ServiceQuote;
    objectExpenseAtDestination: ServiceQuote;
    objectAdditionalService: ServiceQuote;
    tax = new Tax();
    all_observations: any;

    private searchDestination = false;

    private textSearch: string;
    searchConcepts: Observable<any>;
    searchClients: Observable<any>;
    searchPorts: Observable<any>;
    /* START DATA INIT */
    showDataQuote = true;
    files: Array<File> = [];
    filesName: Array<String> = [];
    commercials: Array<Select> = [];
    currencies: Array<Select> = [];
    factors: Array<Select> = [];
    units_of_measured: Array<Select> = [];
    incoterms: Array<Select> = [];
    services_types: Array<Select> = [];
    services = [
        {code: 'IA', description: 'IMPORTACION AEREA'},
        {code: 'EA', description: 'EXPORTACION AEREA'},
        {code: 'IM', description: 'IMPORTACION MARITIMA'},
        {code: 'EM', description: 'EXPORTACION MARITIMA'},
        {code: 'OS', description: 'OTROS SERVICIOS'},
    ];
    vias: Array<Select> = [];
    /* END DATA INIT */
    constructor(private el: ElementRef,
                private conceptService: ConceptService,
                private clientService: ClientService,
                private portService: PortService,
                private quoteService: QuoteService,
    ) {
        this.searchConcepts = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.conceptService.search(this.textSearch)
                    .subscribe((response: any ) => {
                        this.hideLoading();
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });
        this.searchClients = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                this.clientService.search(this.textSearch)
                    .subscribe((response: any ) => {
                        this.hideLoading();
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });
        this.searchPorts = Observable.create((observer: any) => {
            if (this.textSearch.length > 0) {
                const port = this.searchDestination ? this.objectQuote.origin.port : 0;
                this.portService.search(this.textSearch, port)
                    .subscribe((response: any) => {
                        this.hideLoading();
                        if (response.status && response.data.length > 0)
                            observer.next(response.data);
                    });
            }
        });
    }
    ngOnInit() {
        this.initData();
        this.initTables();
        this.all_observations = JSON.parse(this.objectQuote.all_observations);
    }
    initTables() {
        this.objectQuote = new Quote();
        this.focus = false;
        this.creating_group_international_transport = false;
        this.creating_group_expenses_at_origin = false;
        this.creating_group_expenses_at_destination = false;
        this.creating_group_additional_service = false;

        this.cases = [];
        this.internationalTransports = [];
        this.expensesAtOrigin = [];
        this.expensesAtDestination = [];
        this.additionalServices = [];

        this.objectCase = new Case();
        this.objectInternationalTransport = new ServiceQuote();
        this.objectExpenseAtOrigin = new ServiceQuote();
        this.objectExpenseAtDestination = new ServiceQuote();
        this.objectAdditionalService = new ServiceQuote();

        this.cases.push(this.objectCase);
        this.internationalTransports.push(this.objectInternationalTransport);
        this.expensesAtOrigin.push(this.objectExpenseAtOrigin);
        this.expensesAtDestination.push(this.objectExpenseAtDestination);
        this.additionalServices.push(this.objectAdditionalService);

        this.objectQuote.total_volume = 0;
        this.objectQuote.total_weight = 0;
        this.objectQuote.total_cbm = 0;
        this.objectQuote.total_ton = 0;
    }
    initData() {
        Loadding.show();
        this.quoteService.getDataInit().subscribe((response: any) => {
            if (response.status) {
                this.commercials = response.data.commercials;
                this.currencies = response.data.currencies;
                this.factors = response.data.factors;
                this.units_of_measured = response.data.units_of_measured;
                this.incoterms = response.data.incoterms;
                this.services_types = response.data.services_types;
                this.vias = response.data.vias;
            }
        }, error => console.log(error)
         , () => Loadding.close());
    }
    add(type: number, event: any) {
        if ((event.keyCode === 13 || event.keyCode === 10)) {
            this.focus = true;
            switch (type) {
                case 0:
                    this.objectCase = new Case();
                    this.cases.push(this.objectCase);
                    break;
                case 1:
                    if (this.objectError(this.objectInternationalTransport)) {
                        this.objectInternationalTransport = new ServiceQuote();
                        this.objectInternationalTransport.create_group_active = this.creating_group_international_transport;
                        this.internationalTransports.push(this.objectInternationalTransport);
                    }
                    break;
                case 2:
                    if (this.objectError(this.objectExpenseAtOrigin)) {
                        this.objectExpenseAtOrigin = new ServiceQuote();
                        this.objectExpenseAtOrigin.create_group_active = this.creating_group_expenses_at_origin;
                        this.expensesAtOrigin.push(this.objectExpenseAtOrigin);
                    }
                    break;
                case 3:
                    if (this.objectError(this.objectExpenseAtDestination)) {
                        this.objectExpenseAtDestination = new ServiceQuote();
                        this.objectExpenseAtDestination.create_group_active = this.creating_group_expenses_at_destination;
                        this.expensesAtDestination.push(this.objectExpenseAtDestination);
                    }
                    break;
                case 4:
                    if (this.objectError(this.objectAdditionalService)) {
                        this.objectAdditionalService = new ServiceQuote();
                        this.objectAdditionalService.create_group_active = this.creating_group_additional_service;
                        this.additionalServices.push(this.objectAdditionalService);
                    }
                    break;
            }
        }
    }
    deleteField(type: number, i: number) {
        switch (type) {
            case 0:
                if ( this.cases.length > 1 ) {
                    this.cases.splice(i, 1);
                    this.calculateTotals();
                }
                break;
            case 1:
                if ( this.internationalTransports.length > 1 ) {
                    this.internationalTransports.splice(i, 1);
                }
                break;
            case 2:
                if ( this.expensesAtOrigin.length > 1 ) {
                    this.expensesAtOrigin.splice(i, 1);
                }
                break;
            case 3:
                if ( this.expensesAtDestination.length > 1 ) {
                    this.expensesAtDestination.splice(i, 1);
                }
                break;
            case 4:
                if ( this.additionalServices.length > 1 ) {
                    this.additionalServices.splice(i, 1);
                }
                break;
        }
    }
    objectError(object: any) {
        let error = true;
        Object.keys(object).forEach(function(key) {
            if (object[key] instanceof Concept) {
                if (object[key].code === null) {
                    error = false;
                    return;
                }
            }
            if (object[key] === null) {
                error = false;
                return;
            }
        });
        return error;
    }
    setLanguage(language: string) {
        this.language.code = language;
        if (language === 'en') {
            this.language.text = 'Inglés';
        } else if (language === 'es') {
            this.language.text = 'Español';
        }
    }
    updateSubTotal() {
        this.tax.sub_total = (this.tax.total_valorem * 1) + (this.tax.total_iva * 1) + (this.tax.total_perception * 1);
    }
    updateCif() {
        this.tax.cif = (this.tax.fob * 1) + (this.tax.flete * 1) + (this.tax.secure * 1);
    }
    calculateVolume(index: number) {
        const long = this.cases[index].long;
        const width = this.cases[index].width;
        const height = this.cases[index].height;

        if ((long === null || long.toString() === '') ||
            (width === null || width.toString() === '') ||
            (height === null || height.toString() === '')) {
            return false;
        }

        let volume: number;
        let cbm: number;
        switch (this.objectQuote.via_id.toString()) {
            case '2':
                volume = ((long * width * height) / 1000) * this.cases[index].quantity;
                cbm = (this.cases[index].volume / 1000) * this.cases[index].quantity;

                this.cases[index].volume = Number(volume.toFixed(2));
                this.cases[index].cbm = Number(cbm.toFixed(2));
                break;
            default:
                volume = ((long * width * height) / 6000) * this.cases[index].quantity;
                cbm = ((long * width * height) / 1000000) * this.cases[index].quantity;

                this.cases[index].volume = Number(volume.toFixed(2));
                this.cases[index].cbm = Number(cbm.toFixed(2));
                break;
        }
        this.calculateTotals();
    }
    calculateTotals() {
        this.objectQuote.total_volume = this.cases.map(function (x) {
            return x.volume;
        }).reduce((a, b) => (a * 1) + (b * 1));

        this.objectQuote.total_weight = this.cases.map(function (x) {
            return x.weight;
        }).reduce((a, b) => (a * 1) + (b * 1));

        this.objectQuote.total_cbm = this.cases.map(function (x) {
            return x.cbm;
        }).reduce((a, b) => (a * 1) + (b * 1));

        this.objectQuote.total_ton = this.objectQuote.total_weight / 1000;
    }
    selectedVia() {
        this.initTables();
        this.objectQuote.service_type_id = '';
        switch (this.objectQuote.via_id.toString()) {
            case '1':
                this.objectQuote.service_id = 'IA';
                break;
            case '2':
                this.objectQuote.service_id = 'IM';
                break;
            default:
                this.objectQuote.service_id = 'OS';
                break;
        }
    }
    setTotals(array: Array<ServiceQuote>, index: number) {
        const factor = this.objectQuote.total_weight > this.objectQuote.total_volume ?
            this.objectQuote.total_weight : this.objectQuote.total_volume;
        const total_rate = array[index].rate * factor;
        const total_cost = array[index].cost * factor;
        array[index].total_rate = Number(total_rate.toFixed(2));
        array[index].total_cost = Number(total_cost.toFixed(2));
        array[index].margin = array[index].total_rate - array[index].total_cost;
        this.calculateTotalService();
    }
    calculateTotalOfService(type: number, index: number) {
        switch (type) {
            case 1:
                this.setTotals(this.internationalTransports, index);
                break;
            case 2:
                this.setTotals(this.expensesAtOrigin, index);
                break;
            case 3:
                this.setTotals(this.expensesAtDestination, index);
                break;
            case 4:
                this.setTotals(this.additionalServices, index);
                break;
        }
    }
    calculateTotalService() {
        this.objectQuote.total_international_transport = this.internationalTransports.map(function (x) {
            return x.margin;
        }).reduce((a, b) => (a * 1) + (b * 1));

        this.objectQuote.total_expenses_origin = this.expensesAtOrigin.map(function (x) {
            return x.margin;
        }).reduce((a, b) => (a * 1) + (b * 1));

        this.objectQuote.total_expenses_destination = this.expensesAtDestination.map(function (x) {
            return x.margin;
        }).reduce((a, b) => (a * 1) + (b * 1));

        this.objectQuote.total_additional_services = this.additionalServices.map(function (x) {
            return x.margin;
        }).reduce((a, b) => (a * 1) + (b * 1));

        this.objectQuote.total_profit = this.objectQuote.total_international_transport +
                                        this.objectQuote.total_expenses_origin +
                                        this.objectQuote.total_expenses_destination +
                                        this.objectQuote.total_additional_services;
    }
    onDrop(type: number, event: CdkDragDrop<ServiceQuote[]>) {
        switch (type) {
            case 1:
                moveItemInArray(this.internationalTransports, event.previousIndex, event.currentIndex);
                break;
            case 2:
                moveItemInArray(this.expensesAtOrigin, event.previousIndex, event.currentIndex);
                break;
            case 3:
                moveItemInArray(this.expensesAtDestination, event.previousIndex, event.currentIndex);
                break;
            case 4:
                moveItemInArray(this.additionalServices, event.previousIndex, event.currentIndex);
                break;
        }
    }
    setCreateGroupActive(array: Array<ServiceQuote>, creating: boolean) {
        this.group_name = null;
        array.map(function (x) {
            x.create_group_active = creating;
        });
    }
    creatingGroup(type: number, creating: boolean) {
        switch (type) {
            case 1:
                this.creating_group_international_transport = creating;
                this.setCreateGroupActive(this.internationalTransports, creating);
                break;
            case 2:
                this.creating_group_expenses_at_origin = creating;
                this.setCreateGroupActive(this.expensesAtOrigin, creating);
                break;
            case 3:
                this.creating_group_expenses_at_destination = creating;
                this.setCreateGroupActive(this.expensesAtDestination, creating);
                break;
            case 4:
                this.creating_group_additional_service = creating;
                this.setCreateGroupActive(this.additionalServices, creating);
                break;
        }
    }
    setDataGroup(array: Array<ServiceQuote>) {
        const self = this.group_name;
        const colors = this.colors;

        const count_checked = array.filter(function (x) {
            if (!x.color) {
                return x.checked_active;
            }
        });

        if (count_checked.length <= 1) {
            Swal.fire({
                title: 'Debe seleccionar al menos 2 elementos de la lista.',
                type: 'warning',
                confirmButtonText: 'Ok'
            });
        } else if (!self || self.trim() === '') {
            Swal.fire({
                title: 'Escriba un nombre de grupo válido.',
                type: 'warning',
                confirmButtonText: 'Ok'
            });
        } else {
            const hash = [];
            const quantity = array.filter(function (x) {
                const exist = !hash[x.color] || false;
                hash[x.color] = true;
                return exist;
            });
            array.map(function (x) {
                if (x.checked_active && !x.group_name) {
                    x.group_name = self;
                    x.color = colors[quantity.length - 1];
                }
            });

            this.creatingGroup(1, false);
        }
    }
    saveGroup(type: number) {
        switch (type) {
            case 1:
                this.setDataGroup(this.internationalTransports);
                break;
            case 2:
                this.setDataGroup(this.expensesAtOrigin);
                break;
            case 3:
                this.setDataGroup(this.expensesAtDestination);
                break;
            case 4:
                this.setDataGroup(this.additionalServices);
                break;
        }
    }
    deleteDataGroup(array: Array<ServiceQuote>, index: number, event: any): void {
        if (array[index].color) {
            Swal.fire({
                title: 'Está seguro quitar este elemento del grupo.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.value) {
                    array[index].color = '';
                    array[index].group_name = '';
                    array[index].checked_active = false;
                } else {
                    event.target.checked = true;
                }
            });
        }
    }
    deleteGroup(type: number, index: number, event: any) {
        if (event.target.checked) {
            return false;
        }
        switch (type) {
            case 1:
                this.deleteDataGroup(this.internationalTransports, index, event);
                break;
            case 2:
                this.deleteDataGroup(this.expensesAtOrigin, index, event);
                break;
            case 3:
                this.deleteDataGroup(this.expensesAtDestination, index, event);
                break;
            case 4:
                this.deleteDataGroup(this.additionalServices, index, event);
                break;
        }
    }
    showLoading() {
        this.elementLoading.classList.remove('hide');
        this.elementLoading.classList.add('show');
    }
    hideLoading() {
        this.elementLoading.classList.remove('show');
        this.elementLoading.classList.add('hide');
    }

    setTextSearch(event: any): void {
        if (this.specialKeys.indexOf(event.key) !== -1) { return; }

        this.textSearch = event.target.value;
        this.elementLoading = event.target.nextSibling;

        if (this.textSearch.length > 0) {
            this.showLoading();
        } else {
            this.hideLoading();
        }

        if (event.target.id === 'search-origin') {
            this.searchDestination = false;
            this.objectQuote.destination = new Port();
        }
        if (event.target.id === 'search-destination') {
            this.searchDestination = true;
        }
    }
    /********* CONCEPTS ***********/
    onSelectConcept(type: number, index: number, event: TypeaheadMatch): void {
        switch (type) {
            case 1:
                this.internationalTransports[index].concept = event.item;
                this.internationalTransports[index].concept_id = this.internationalTransports[index].concept.code;
                this.internationalTransports[index].type = type;
                break;
            case 2:
                this.expensesAtOrigin[index].concept = event.item;
                this.expensesAtOrigin[index].concept_id = this.expensesAtOrigin[index].concept.code;
                this.expensesAtOrigin[index].type = type;
                break;
            case 3:
                this.expensesAtDestination[index].concept = event.item;
                this.expensesAtDestination[index].concept_id = this.expensesAtDestination[index].concept.code;
                this.expensesAtDestination[index].type = type;
                break;
            case 4:
                this.additionalServices[index].concept = event.item;
                this.additionalServices[index].concept_id = this.additionalServices[index].concept.code;
                this.additionalServices[index].type = type;
                break;
        }
    }
    /********* END CONCEPTS ***********/
    /********* CLIENTS ***********/
    onSelectClient(event: TypeaheadMatch): void {
        this.objectQuote.client = event.item;
        this.objectQuote.client_id = this.objectQuote.client.code;
    }
    /********* END CLIENTS ***********/
    /********* PORTS ***********/
    onSelectPortOrigin(event: TypeaheadMatch): void {
        this.objectQuote.origin = event.item;
        this.objectQuote.port_origin_id = this.objectQuote.origin.port;
        this.objectQuote.country_origin_id = this.objectQuote.origin.country;
    }
    onSelectPortDestination(event: TypeaheadMatch): void {
        this.objectQuote.destination = event.item;
        this.objectQuote.port_destination_id = this.objectQuote.destination.port;
        this.objectQuote.country_destination_id = this.objectQuote.destination.country;
    }
    /********* END CLIENTS ***********/
    openSelectedFile() {
        document.getElementById('selected-file').click();
    }
    fileSelectionEvent(fileInput: any) {
        if (fileInput.target.files.length > 0) {
            for (let i = 0; i < fileInput.target.files.length; i++) {
                const nameFile = fileInput.target.files[i].name;
                if (this.filesName.indexOf(nameFile) !== -1) { return; }
                this.files.push(fileInput.target.files[i]);
                this.filesName.push(nameFile);
            }
        }
    }
    deleteFile(index: number) {
        Swal.fire({
            title: 'Está seguro eliminar este documento.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                this.files.splice(index, 1);
                this.filesName.splice(index, 1);
            }
        });
    }
    saveQuote(is_pricing = false) {
        const cases = this.cases.filter(x => {
            if (x.package_id || x.height || x.long || x.width) { return x; }
        });

        const internationalTransports = this.internationalTransports.filter(x => {
            if (x.concept_id) { return x; }
        });

        const expensesAtOrigin = this.expensesAtOrigin.filter(x => {
            if (x.concept_id) { return x; }
        });

        const expensesAtDestination = this.expensesAtDestination.filter(x => {
            if (x.concept_id) { return x; }
        });

        const additionalServices = this.additionalServices.filter(x => {
            if (x.concept_id) { return x; }
        });

        let services = [];
        services = services.concat(internationalTransports, expensesAtOrigin, expensesAtDestination, additionalServices);

        Loadding.show('Guardando Datos...');
        const formData: any = new FormData();
        formData.append('user_id', environment.user.code);
        this.objectQuote.is_pricing = is_pricing;
        Utility.convertModelToFormData(this.objectQuote, formData, 'quote');
        Utility.convertModelToFormData(cases, formData, 'cases');
        Utility.convertModelToFormData(services, formData, 'services');
        Utility.convertModelToFormData(this.tax, formData, 'tax');
        for (let i = 0; i < this.files.length; i++) {
            formData.append('files[]', this.files[i], this.files[i]['name']);
        }
        this.quoteService.save(formData).subscribe((response: any) => {
            if (response.status && !is_pricing) {
                Swal.fire({
                    title: response.data.title,
                    text: response.data.message,
                    type: 'success',
                    confirmButtonText: 'Con Totales',
                    cancelButtonText: 'Sin Totales',
                    showCancelButton: true,
                    showCloseButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-default',
                }).then((result) => {
                    let href = `${environment.api.url}quote/${response.data.code}/pdf`;
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        href = `${environment.api.url}quote/${response.data.code}/custom-pdf`;
                    }

                    if (result.value || result.dismiss === Swal.DismissReason.cancel) {
                        const link = document.createElement('a');
                        link.href = href;
                        link.target = '_blank';
                        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                        link.remove();
                    }
                });
            } else {
                Swal.fire({
                    title: response.data.title,
                    html: response.data.message,
                    type: response.data.type,
                });
            }

            if (response.data.type !== 'error') {
                this.initTables();
            }

        });
    }
    sendPricing() {
        this.saveQuote(true);
    }

    changeValid(days) {
        this.objectQuote.expired_in = Number(this.objectQuote.expired_in) + Number(days);
    }

    searchQuote(event: any) {
        Loadding.show();
        this.quoteService.searchByCode(event.target.value).subscribe((response: any) => {
            this.internationalTransports = [];
            this.expensesAtOrigin = [];
            this.expensesAtDestination = [];
            this.additionalServices = [];
            response.data.map( x => {
                 x.create_group_active = null;
                 x.checked_active = null;
                 if (x.type === 1) { this.internationalTransports.push(x); }
                 if (x.type === 2) { this.expensesAtOrigin.push(x); }
                 if (x.type === 3) { this.expensesAtDestination.push(x); }
                 if (x.type === 4) { this.additionalServices.push(x); }
             });
             Loadding.close();
        });
    }
}
