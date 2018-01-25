import { Component } from '@angular/core';

@Component({
  selector: 'activity-list',
  templateUrl: 'activity-list.html'
})
export class ActivityListComponent {

  // @ViewChild('scrollItem') scrollItem: ElementRef;
  height: string;

  constructor() {
    this.height = '0px';
  }

  onPan(event: any) {
    this.height = 'calc(100vh - ' + event.center.y + 'px';
  }

  onClick(event: any) {
    this.height = '30vh';
  }

}
