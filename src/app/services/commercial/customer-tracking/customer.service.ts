import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Customer } from '../../../models/commercial/customer-tracking/Customer';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    public newCustomerSubject = new Subject<any>();
    public editCustomerSubject = new Subject<any>();
    public seeCommentsSubject = new Subject<any>();
    public orderCustomersSubject = new Subject<any>();
  constructor(private http: HttpClient) { }

  getAllCustomers(user_id: any) {
    return this.http.get<any>(`${environment.api.url}commercial/customer-tracking/user/${user_id}/clients`);
  }
  addCustomer(customer: Customer) {
      this.newCustomerSubject.next(customer);
  }
  editCustomer(customer: Customer) {
      this.editCustomerSubject.next(customer);
  }
  seeCommentsByCustomer(customer: Customer) {
      this.seeCommentsSubject.next(customer);
  }
  orderCustomers(customer_id: number) {
      this.orderCustomersSubject.next(customer_id);
  }
  save(customer: Customer) {
    return this.http.post<any>(`${environment.api.url}commercial/customer-tracking/clients`, customer)
      .pipe(map(response => {
          return response;
      })
    );
  }
  find(id: number) {
      return this.http.get(`${environment.api.url}commercial/customer-tracking/clients/${id}/edit`)
          .pipe(map(response => {
                  return response;
              })
          );
  }
  update(id: number, customer: Customer) {
      return this.http.put<any>(`${environment.api.url}commercial/customer-tracking/clients/${id}`, customer)
          .pipe(map(response => {
                  return response;
              })
          );
  }
  assignedCommercial(id: number, customerId: number) {
      const data = {id: id, user_id: customerId, created_by: environment.user.code};
      return this.http.post<any>(`${environment.api.url}commercial/customer-tracking/assigned-commercial`, data)
            .pipe(map(response => {
                    return response;
                })
            );
  }
  getAllCommercials() {
      return this.http.get<any>(`${environment.api.url}commercial/customer-tracking/commercials`);
  }
  uploadImage(formData) {
      return this.http.post<any>(`${environment.api.url}commercial/customer-tracking/thumbnail`, formData);
  }
}
