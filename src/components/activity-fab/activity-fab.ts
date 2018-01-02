import { Component } from '@angular/core';
import { StatusProvider } from '../../providers/status/status';
import { SelectedActivity } from './../../models/enums';

@Component({
  selector: 'activity-fab',
  templateUrl: 'activity-fab.html'
})
export class ActivityFabComponent {

  isActivitySliderOpened = false;
  isMenuOpened = false;

  constructor(public statusProvider: StatusProvider) {}

  onRangeBlur(event: any) {
    this.statusProvider.activitySearched.next();
  }

  onFabClicked(event: MouseEvent) {
    this.isActivitySliderOpened = !this.isActivitySliderOpened;
    // this.statusProvider.activitySliderOpened.next(this.isActivitySliderOpened);
  }

  onMenuClick(event: MouseEvent) {
    this.isMenuOpened = !this.isMenuOpened;
  }

  onActivitySelected(event: any, selectedActivity: SelectedActivity) {
    this.statusProvider.selectedActivity.next(selectedActivity);
    this.statusProvider.activityPressed.next();
  }

}
