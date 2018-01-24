import { Component } from '@angular/core';
import { StatusProvider } from '../../providers/status/status';
import { SelectedActivity } from './../../models/enums';

@Component({
  selector: 'activity-fab',
  templateUrl: 'activity-fab.html'
})
export class ActivityFabComponent {

  isActivitySliderOpened = false;

  constructor(public statusProvider: StatusProvider) {}

  onActivitySelected(event: any, selectedActivity: SelectedActivity) {
    this.statusProvider.selectedActivity.next(selectedActivity);
  }

}
