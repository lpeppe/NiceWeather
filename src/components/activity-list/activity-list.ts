import { Component, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Gesture } from 'ionic-angular/gestures/gesture';

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
}
