import {AfterViewInit, Component, OnInit, TemplateRef} from '@angular/core';
import {Customer} from '../../../../../models/commercial/customer-tracking/Customer';
import {CustomerService} from '../../../../../services/commercial/customer-tracking/customer.service';
import {ClientExtraDataService} from '../../../../../services/commercial/customer-tracking/client-extra-data.service';
import {environment} from '../../../../../../environments/environment';
import {first} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {CommercialService} from '../../../../../services/commercial/customer-tracking/commercial.service';
import {DataCalendarService} from '../../../../../services/commercial/customer-tracking/data-calendar.service';
import {Select} from '../../../../../models/Select';
import {UserService} from '../../../../../services/user.service';
import {Loadding} from '../../../../../utils/Loading';

declare let $: any;

@Component({
	selector: 'app-list-clients',
	templateUrl: './list-clients.component.html',
	styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit, AfterViewInit {
	customer: Customer;
	customers: Customer[];
	commercials: Array<Select> = [];
	filteredCustomers: Customer[];
    is_commercial_manager: boolean = environment.commercial_manager;
    created_by = environment.user.code;
    modalRef: BsModalRef;
    maxDate: Date;
    bsRangeValue: Date[];
	constructor(
		private customerService: CustomerService,
		private clientExtraDataService: ClientExtraDataService,
        private commercialService: CommercialService,
        private userService: UserService,
        private dataCalendarService: DataCalendarService,
        private modalService: BsModalService
	) {}

	ngOnInit() {
		this.init();
	}

	listClients(commercial_id: number) {
        this.customerService.getAllCustomers(commercial_id).subscribe(response => {
            if (response.status) {
                this.customers = response.data;
                this.filteredCustomers = this.customers;
            }
        });
	}

	init() {
        this.maxDate = new Date();
        this.bsRangeValue = [];

		this.listClients(Number(environment.user.code));

		this.customerService.newCustomerSubject.subscribe(data => {
			const index = this.customers.findIndex(x => x.ruc === data.ruc);
			console.log(index);
			if (index < 0) {
				this.filteredCustomers = [data, ...this.filteredCustomers];
                this.customers = [data, ...this.customers];
			} else {
				data.thumbnails = this.customers[index].thumbnails;

				console.log(data);
				console.log(this.customers[index].thumbnails);

                this.filteredCustomers[index] = data;
                this.customers[index] = data;
			}
		});
		/*this.clientExtraDataService.updateExtraDataSubject.subscribe(extraData => {
			this.filteredCustomers.find((customer: Customer) => {
				if (customer.id === extraData.client_id) {
					customer.extra_data = extraData;
				}
				return true;
			});
		});*/
        this.customerService.getAllCommercials().subscribe((response: any) => {
            if (response.status)
                this.commercials = response.data;
        });
        this.customerService.orderCustomersSubject.subscribe(data => {
            const index = this.customers.findIndex(x => x.id === data);
            if (index > 0) {
            	const new_customer: Customer = this.customers[index];
            	this.customers.splice(index, 1);
            	this.customers.unshift(new_customer);

            	const _index = this.filteredCustomers.findIndex(x => x.id === data);
            	if (_index > 0) {
                    const _new_customer: Customer = this.filteredCustomers[index];
                    this.filteredCustomers.splice(_index, 1);
                    this.filteredCustomers.unshift(_new_customer);
				}
            }
        });
	}

	selectedCustomer(id: number) {
		this.customer = this.customers.find( customer => customer.id === id );
		this.customerService.seeCommentsByCustomer(this.customer);
	}

	filterCustomer(event: any) {
		const search: string = event.target.value;
		this.filteredCustomers = this.customers.filter(customer => {
			return customer.ruc.toLowerCase().indexOf(search.toLowerCase()) !== -1 || customer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
		});
	}
	extraData(customer: Customer) {
		this.clientExtraDataService.passExtraData(customer);
		document.getElementById('side-three').classList.remove('close-sidebar');
		document.getElementById('side-three').classList.add('open-sidebar');
	}

	openForm() {
		document.getElementById('side-two').classList.remove('close-sidebar');
		document.getElementById('side-two').classList.add('open-sidebar');
	}

	ngAfterViewInit() {
		$('#my-scroll').slimScroll({height: 'calc(100% - 60px)'});
	}

    findCustomer(idCustomer: number) {
		this.customerService.find(idCustomer).pipe(first()).subscribe((response: any) => {
			if (response.status) {
				this.customerService.editCustomer(response.data);
                this.openForm();
			}
		});
	}

    openModal(template: TemplateRef<any>, customer_id: number) {
		this.customer = this.customers.find(x => x.id === customer_id);
        const index = this.commercials.findIndex(x => x.code === this.customer.user_id);
        this.commercials.slice(index, 1);
        this.modalRef = this.modalService.show(template);
    }

    assignedCommercial(id: number) {
		this.customerService.assignedCommercial(this.customer.id, id)
			.pipe(first())
			.subscribe((response: any) => {
				if (response.status) {
                    const index = this.customers.findIndex(x => x.id === this.customer.id);
                    //this.customers.splice(index, 1);
                    this.filteredCustomers.splice(index, 1);
                    this.modalRef.hide();
				}
			}, error => console.log(error));
	}

    changeCommercial(event: any) {
		const commercial_id = event.target.value === '' ? environment.user.code : event.target.value;
		this.listClients(commercial_id);
		this.dataCalendarService.showDataCalendar([]);
	}

    downloadData() {
        if (this.bsRangeValue.length === 2) {
        	const dateStart = this.bsRangeValue[0].toDateString();
        	const dateEnd = this.bsRangeValue[1].toDateString();
        	this.commercialService.exportData([new Date(dateStart), new Date(dateEnd)]).subscribe((response: any) => {
                const blob = new Blob([response], {type: 'application/ms-excel'});
                const fileUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = 'customer-tracking.xlsx';
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                setTimeout(function () {
                    window.URL.revokeObjectURL(fileUrl);
                    link.remove();
                }, 100);
        	});
        }
        this.bsRangeValue = [];
    }
}
