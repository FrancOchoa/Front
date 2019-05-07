import { Component, OnInit } from '@angular/core';
import {User} from '../../../../../models/user';
import {CustomerService} from '../../../../../services/commercial/customer-tracking/customer.service';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../../../../models/commercial/customer-tracking/Customer';
import {ClientDataSunatService} from '../../../../../services/client-data-sunat.service';
import {environment} from '../../../../../../environments/environment';
declare var $;

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent implements OnInit {
  private customer: Customer;
  exist: Boolean = false;
  registerForm: FormGroup;
  private user: User;
  readonly: Boolean = false;
  edit: Boolean = false;
  textBtn = 'Guardar';
  private customerId: number;
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private clientDataSunatService: ClientDataSunatService
  ) {}

  ngOnInit() {
      this.validator();
      this.customerService.editCustomerSubject.subscribe(data => {
          this.textBtn = 'Actualizar';
          this.readonly = true;
          this.edit = true;
          this.customerId = data.id;
          this.registerForm.controls['type'].patchValue(data.type);
          this.registerForm.controls['ruc'].patchValue(data.ruc);
          this.registerForm.controls['name'].patchValue(data.name);
          this.registerForm.controls['contact'].patchValue(data.contact);
          this.registerForm.controls['phone'].patchValue(data.phone);
          this.registerForm.controls['email'].patchValue(data.email);
          this.registerForm.controls['address'].patchValue(data.address);
      });
  }
  onRegister() {
    if (this.edit) {
      this.update();
    } else {
      this.register();
    }
  }
  register() {
    this.exist = false;
    if (this.registerForm.invalid) { return; }
    this.customer = this.registerForm.value;
    this.customer.user_id = environment.user.code;
    this.customerService.save(this.customer)
      .pipe(first())
      .subscribe(response => {
        if (response.status) {
          if (response.data.user) {
            this.user = response.data.user;
            this.exist = true;
          } else {
            this.closeForm();
            this.customerService.addCustomer(response.data);
          }
        }
      }, error => {
        console.log('error');
        console.log(error);
      });
  }
  update() {
      this.exist = false;
      if (this.registerForm.invalid) { return; }
      this.customer = this.registerForm.value;
      this.customer.user_id = environment.user.code;
      this.customerService.update(this.customerId, this.customer)
          .pipe(first())
          .subscribe(response => {
              if (response.status) {
                  this.closeForm();
                  this.customerService.addCustomer(response.data);
              }
          }, error => {
              console.log('error');
              console.log(error);
          });
  }
  search() {
      this.clientDataSunatService.find(this.registerForm.value.ruc).subscribe( response => {
          if (!response.status) {
              alert(response.message);
          } else {
              this.readonly = true;
              this.registerForm.controls['ruc'].patchValue(response.data.ruc);
              this.registerForm.controls['name'].patchValue(response.data.social_reason);
              this.registerForm.controls['address'].patchValue(response.data.address);
          }
      });
  }
  validator() {
      this.registerForm = this.formBuilder.group({
          type: ['own', Validators.required],
          name: ['', Validators.required],
          contact: ['', [Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
          phone: ['', [Validators.required]],
          email: [''],
          address: ['', Validators.required],
          ruc: ['', [Validators.required, Validators.minLength(10)]],
      });
  }
  get valid() {
      return this.registerForm.controls;
  }
  closeForm() {
      document.getElementById('side-two').classList.remove('open-sidebar');
      document.getElementById('side-two').classList.add('close-sidebar');
      this.textBtn = 'Guardar';
      this.readonly = false;
      this.edit = false;
      this.exist = false;
      this.registerForm.reset();
      this.registerForm.controls['type'].patchValue('own');
  }
}
