import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ClientExtraData} from '../../../../../models/commercial/customer-tracking/ClientExtraData';
import {ClientExtraDataService} from '../../../../../services/commercial/customer-tracking/client-extra-data.service';
import {environment} from '../../../../../../environments/environment';
import {FileUploadService} from '../../../../../services/commercial/customer-tracking/file-upload.service';
import {ErrorAlert, Loadding} from '../../../../../utils/Loading';

@Component({
    selector: 'app-form-extra-data',
    templateUrl: './form-extra-data.component.html',
    styleUrls: ['./form-extra-data.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FormExtraDataComponent implements OnInit {
    private client_id = 0;
    extra_data: Array<any> = [];
    constructor(
        private clientExtraDataService: ClientExtraDataService,
        private fileUploadService: FileUploadService
    ) { }

    ngOnInit() {
        this.clientExtraDataService.extraDataSource.subscribe(customer => {
            this.client_id = customer.id;
            this.extra_data = customer.extra_data;
        });
    }

    sendExtraData(event: any) {
        const formData: any = new FormData();
        const files: Array<File> = <Array<File>>event.target.files;
        formData.append('created_by', environment.user.code);
        formData.append('module', 'customer-extra-data');
        formData.append('module_id', this.client_id);
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i], files[i]['name']);
        }

        this.fileUploadService.uploadBase(formData).subscribe(
            (response: any) => {

                console.log(response);

                if (response !== undefined) {
                    if (response.status === 'finish') {
                        const response_server = response.data;
                        console.log(response_server);
                        if (response_server.status) {
                            for (let i = 0; i < response_server.data.length; i++) {
                                this.extra_data.unshift(response_server.data[i]);
                            }
                        } else {
                            ErrorAlert.show(response.message);
                        }
                    }
                }
            }
        );
    }

    deleteFile(id: number, index: number) {
        Loadding.showDelete(function () {
            this.fileUploadService.delete(id).subscribe((response: any) => {
                if (response.status) {
                    this.extra_data.splice(index, 1);
                }
            });
        }.bind(this));
    }

    close() {
        document.getElementById('side-three').classList.remove('open-sidebar');
        document.getElementById('side-three').classList.add('close-sidebar');
    }
}
