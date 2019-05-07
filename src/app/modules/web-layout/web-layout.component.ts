import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class WebLayoutComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
    document.body.className = 'layout-top-nav skin-red-light';
  }
  ngOnDestroy(): void {
    document.body.className = '';
  }

}
