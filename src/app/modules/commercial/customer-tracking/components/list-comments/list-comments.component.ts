import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CustomerService} from '../../../../../services/commercial/customer-tracking/customer.service';
import {Customer} from '../../../../../models/commercial/customer-tracking/Customer';
import {Comment} from '../../../../../models/commercial/customer-tracking/Comment';
import {CommentService} from '../../../../../services/commercial/customer-tracking/comment.service';
import {DataCalendarService} from '../../../../../services/commercial/customer-tracking/data-calendar.service';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import * as moment from 'moment';
import {environment} from '../../../../../../environments/environment';

declare var $;

@Component({
  selector: 'app-list-comments',
  templateUrl: './list-comments.component.html',
  styleUrls: ['./list-comments.component.css'],
})
export class ListCommentsComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  scrollButton: Boolean = false;
  customer: Customer;
  comments: Comment[];
  minDate: Date;
  created_by = environment.user.code;
  constructor(
    private customerService: CustomerService,
    private commentService: CommentService,
    private dataCalendarService: DataCalendarService,
    private ref: ChangeDetectorRef,
  ) {
    this.minDate = new Date();
    defineLocale('es', esLocale);
  }

  ngOnInit() {
    this.initComponent();
  }
  initComponent() {
    this.customerService.seeCommentsSubject.subscribe(customer => {
      this.scrollButton = true;
      this.customer = customer;
      this.getAllCommentsByCustomer(this.customer.id);
    });
    this.commentService.newCommentSubject.subscribe( data => {
      this.scrollButton = true;
      this.comments.push(data);
    });
  }
  getAllCommentsByCustomer(customer_id: number) {
    this.commentService.getAllCommentsByCustomer(customer_id).subscribe(response => {
      if (response.status) {
        this.comments = response.data;
      }
    }, error => {
      console.log(error);
    }, () => {
      this.ref.detectChanges();
      return true;
    });
  }
  updateDate(comment: Comment, dp: any) {
    const value: Date = dp._bsValue;
    const date: string = comment.date ? comment.date.toString() : '';
    if (value !== null && (moment(value).format('YYYY-MM-DD') !== date)) {
      const data = { 'date': value };
      this.commentService.updateDateOrHour(comment.id, data).subscribe(response => {
        if (!response.status) {
          dp._bsValue = null;
        } else {
          comment.date = value;
          this.dataCalendarService.addDataCalendar(comment);
        }
      }, error => console.log(error));
    }
  }
  toggle(dp) {
    if (dp._bsValue != null && dp._bsValue.length === 10) {
      dp._bsValue = new Date(dp._bsValue.replace('-', '.'));
    }
    dp.toggle();
  }
  setTime(comment: Comment) {
    if (comment.hour != null) {
      comment.hour = new Date('1970-01-01T' + comment.hour);
    }
  }
  changedTime(comment: Comment, $event: any) {
    comment.hour = moment($event).format('HH:mm');
  }
  updateTime(comment: Comment) {
    if (comment.hour != null) {
      const data = { 'hour': comment.hour };
      this.commentService.updateDateOrHour(comment.id, data).subscribe(response => {
        if (!response.status) {
          comment.hour = null;
        } else {
          this.dataCalendarService.addDataCalendar(comment);
          $('popover-container[role=tooltip]').hide();
        }
        }, error => console.log(error));
    }
  }
  updateScrollHeight(scrollHeight: number) {
    if (this.scrollButton) {
      $('.slimScrollBar').css('opacity', 0.4);
      $('#my-scroll-comments').slimScroll({
        scrollTo: scrollHeight,
      });
      this.scrollButton = false;
    }
  }
  ngAfterViewInit() {
    $('#my-scroll-comments').slimScroll({
      'max-height': 'calc(100% - 80px)',
      height: 'calc(100% - 80px)',
      width: '100%',
      opacity: 0,
    });
  }
}
