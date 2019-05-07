import {Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef} from '@angular/core';
import {CustomerService} from '../../../services/commercial/customer-tracking/customer.service';
import {Customer} from '../../../models/commercial/customer-tracking/Customer';
import {Comment} from '../../../models/commercial/customer-tracking/Comment';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import {DataCalendarService} from '../../../services/commercial/customer-tracking/data-calendar.service';
import {DataCalendar} from '../../../models/commercial/customer-tracking/DataCalendar';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {Info, Loadding} from '../../../utils/Loading';

@Component({
  selector: 'app-customer-tracking',
  templateUrl: './customer-tracking.component.html',
  styleUrls: ['./customer-tracking.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerTrackingComponent implements OnInit {
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  visible: Boolean = false;
  private customer: Customer;
  name_customer = '';
  ruc = '';
  phone = '';
  email = '';
  listDataCalendar: DataCalendar[] = [];
  constructor(
      private customerService: CustomerService,
      private dataCalendarService: DataCalendarService) {}

  ngOnInit() {
    this.initComponent();
    this.initFullCalendar();
  }
  showCalendar() {
    this.visible = false;
    this.ucCalendar.renderEvents(this.listDataCalendar);
  }
  initComponent() {
    this.dataCalendarService.showDataCalendarSubject.subscribe((dataCalendar: Array<DataCalendar>) => {
      this.visible = false;
      this.ucCalendar.renderEvents(dataCalendar);
    });
    this.customerService.seeCommentsSubject.subscribe((customer: Customer) => {
      this.customer = customer;
      this.name_customer = customer.name;
      this.ruc = customer.ruc;
      this.phone = customer.phone;
      this.email = customer.email;
      this.visible = true;
      if (customer.thumbnails.length > 0) {
        document.getElementById('image-client').setAttribute('src', customer.thumbnails[0].link);
      } else {
        document.getElementById('image-client').setAttribute('src', 'http://niahousing.com/img/company2.png');
      }
    });
    this.dataCalendarService.newDataCalendar.subscribe((comment: Comment) => {
      const id: number = Number(comment.id);
      const dataCalendar: DataCalendar = this.listDataCalendar.find(data => {
        if (data.id === id) {
          let date: string = moment(comment.date).format('YYYY-MM-DD');
          if (comment.hour != null) {
            date += 'T' + comment.hour;
            data.allDay = false;
          }
          data.start = date;
        }
        return data.id === id;
      });
      if (!dataCalendar) {
        let color = '#d2d6de';
        let textColor = '#FFFFFF';
        if (comment.type === 'cite') { color = '#f39c12'; }
        if (comment.type === 'call') { color = '#00a65a'; }
        if (comment.type === 'comment') { textColor = '#000000'; }
        this.listDataCalendar.push({
          id: Number(comment.id),
          title: comment.comment,
          start: moment(comment.date).format('YYYY-MM-DD'),
          backgroundColor: color,
          borderColor: color,
          textColor: textColor,
          allDay: true,
          extra_data: {
            user: '',
            client: '',
          }
        });
      }
    });
  }
  initFullCalendar() {
    this.dataCalendarService.getAllData(environment.user.code)
      .subscribe(response => {
        response.forEach((data: any) => {
          let color = '#d2d6de';
          let textColor = '#FFFFFF';
          let allDay = true;
          if (data.type === 'cite') { color = '#f39c12'; }
          if (data.type === 'call') { color = '#00a65a'; }
          if (data.type === 'comment') { textColor = '#000000'; }
          let date: string = data.date.toString();
          if (data.hour != null) {
            date += 'T' + data.hour;
            allDay = false;
          }
          this.listDataCalendar.push({
            id: Number(data.id),
            title: data.comment,
            start: date,
            backgroundColor: color,
            borderColor: color,
            textColor: textColor,
            allDay: allDay,
            extra_data: {
              user: data.user.full_name,
              client: data.client,
            }
          });
        });
        this.calendarOptions = {
          height: 'parent',
          defaultView: 'month',
          editable: false,
          eventLimit: false,
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          },
          selectable: false,
          events: this.listDataCalendar,
          timeFormat: 'H(:mm)',
          locale: 'es'
        };
      }, error => console.log(error));
  }

  eventClick(model) {
    const event = model.event;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date_start = new Date(event.start._i).toLocaleDateString('es-PE', options);
    const date_end = new Date(event.start._f).toLocaleDateString('es-PE', options);

    let html = '<ul class="list-unstyled text-left">';
    html += `<li class="text-capitalize"><span class="text-bold">Cliente: </span>${event.extra_data.client.name}</li>`;
    html += `<li class="text-capitalize"><span class="text-bold">Usuario: </span>${event.extra_data.user}</li>`;
    html += `<li class="text-capitalize"><span class="text-bold">Fecha: </span>${date_start}</li>`;
    html += `<li><span class="text-bold">Mensaje: </span>${event.title}</li>`;
    html += '</ul>';
    Info.show(html);
  }

  openInputFile() {
    document.getElementById('input-file').click();
  }

  updateImage(event: any) {
    const formData: any = new FormData();
    const files: File = <File> event.target.files;
    formData.append('user_id', environment.user.code);
    formData.append('customer_id', this.customer.id);
    formData.append('module', 'customer-tracking');
    formData.append('ruc', this.ruc);
    formData.append('image', files[0], files[0]['name']);

    this.customerService.uploadImage(formData).subscribe((response: any) => {
      if (response.status) {
        document.getElementById('image-client').setAttribute('src', response.data[0].link);
        document.getElementById('icon-user-' + this.ruc).setAttribute('src', response.data[0].link);
        this.customer.thumbnails = response.data;
        this.customerService.editCustomer(this.customer);
      }
    });
  }
}
