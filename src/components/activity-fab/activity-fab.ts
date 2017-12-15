import { Component } from '@angular/core';
import { StatusProvider } from '../../providers/status/status';

@Component({
  selector: 'activity-fab',
  templateUrl: 'activity-fab.html'
})
export class ActivityFabComponent {

  isOpened = false;

  constructor(public statusProvider: StatusProvider) {}

  onRangeChanged(event: any) {
    this.statusProvider.rangeChanged.next(<number>event._value);
  }

  onSearch(event: any) {
    this.statusProvider.activitySearched.next();
  }

  onFabClicked(event: MouseEvent) {
    this.isOpened = !this.isOpened;
    this.statusProvider.activityMenuOpened.next(this.isOpened);
  }

}
