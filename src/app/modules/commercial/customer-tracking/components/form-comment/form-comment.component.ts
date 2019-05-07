import {Component, OnInit} from '@angular/core';
import {Comment} from '../../../../../models/commercial/customer-tracking/Comment';
import {Customer} from '../../../../../models/commercial/customer-tracking/Customer';
import {CommentService} from '../../../../../services/commercial/customer-tracking/comment.service';
import {CustomerService} from '../../../../../services/commercial/customer-tracking/customer.service';
import {FileUploadService} from '../../../../../services/commercial/customer-tracking/file-upload.service';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-form-comment',
  templateUrl: './form-comment.component.html',
  styleUrls: ['./form-comment.component.css']
})
export class FormCommentComponent implements OnInit {
  private customer: Customer;
  comment: Comment = {
    type: 'comment',
    icon: 'far fa-smile-beam',
    mood: 5,
    comment: null,
    client_id: 0,
    user_id: environment.user.code,
  };
  fileUpload = {status: '', message: 0, data:  null};
  constructor(
    private customerService: CustomerService,
    private commentService: CommentService,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit() {
    this.initComponent();
  }
  addComment(event: any) {
    if ((event.keyCode === 13 || event.keyCode === 10) && !event.shiftKey) {
      console.log(this.comment);
      this.comment.comment = this.comment.comment.trim();
      if (this.comment.comment) {
        this.commentService.saveComment(this.comment).subscribe(response => {
          if (response.status) {
            this.commentService.addComment(response.data);
            this.customerService.orderCustomers(this.comment.client_id);
            this.clearAll();
          }
        }, error => console.log(error) );
      }
      return false;
    }
  }
  moods(level: number, event: any) {
    this.comment.mood = level;
    this.comment.icon = event.target.className;
    document.getElementById('face').className = event.target.className + ' fa-2x';
  }
  selectedType(type: string) {
    this.comment.type = type;
    let color = 'default';
    let text = 'Comentario ';
    switch (type) {
      case 'cite':
        color = 'warning';
        text = 'Cita ';
        break;
      case 'call':
        color = 'success';
        text = 'Llamada ';
        break;
      default:
        color = 'default';
        text = 'Comentario ';
        break;
    }
    document.getElementById('btn-options').className = 'btn btn-' + color + ' dropdown-toggle';
    document.getElementById('text-option').innerHTML = text;
  }
  initComponent() {
    this.customerService.seeCommentsSubject.subscribe(customer => {
      this.customer = customer;
      this.comment.client_id = this.customer.id;
    });
  }
  clearAll() {
    this.comment.comment = '';
    this.comment.mood = 5;
    this.comment.icon = 'far fa-smile-beam';
    this.comment.type = 'comment';
    document.getElementById('face').className = 'far fa-laugh fa-2x';
    document.getElementById('btn-options').className = 'btn btn-default dropdown-toggle';
    document.getElementById('text-option').innerHTML = 'Comentario';
  }
  /* Save Files */
  openInputFile() {
    document.getElementById('input-files').click();
  }
  sendData(event: any) {
    const formData: any = new FormData();
    const files: Array<File> = <Array<File>>event.target.files;
    formData.append('user_id', environment.user.code);
    formData.append('customer_id', this.customer.id);
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i], files[i]['name']);
    }

    this.fileUploadService.upload(formData).subscribe(
      response => {
        if (response !== undefined) {
          this.fileUpload = response;
          if (response.status === 'finish') {
            const response_server = response.data;
            if (response_server.status) {
              this.commentService.addComment(response_server.data);
            } else {
              console.log(response_server.message);
            }
          }
        }
      },
      error => {
        this.fileUpload.status = 'finish';
        console.log(error);
      }
    );
  }
}
