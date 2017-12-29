import { Component } from '@angular/core';
import { StatusProvider } from '../../providers/status/status';

@Component({
  selector: 'activity-fab',
  templateUrl: 'activity-fab.html'
})
export class ActivityFabComponent {

  isActivitySliderOpened = false;
  isMenuOpened = false;

  constructor(public statusProvider: StatusProvider) {}

  onRangeChanged(event: any) {
    this.statusProvider.rangeChanged.next(<number>event._value);
  }

  onRangeBlur(event: any) {
    this.statusProvider.activitySearched.next();
  }

  onFabClicked(event: MouseEvent) {
    this.isActivitySliderOpened = !this.isActivitySliderOpened;
    this.statusProvider.activitySliderOpened.next(this.isActivitySliderOpened);
  }

  onMenuClick(event: MouseEvent) {
    this.isMenuOpened = !this.isMenuOpened;
  }

}
