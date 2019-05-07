import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  isActive: boolean;

  constructor() { }

  ngOnInit() {
    this.isActive = false;
  }
  eventCalled() {
    this.isActive = !this.isActive;
  }
}
