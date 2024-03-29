import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { StatusProvider } from '../../providers/status/status';
import { SelectedActivity } from './../../models/enums';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';

@Component({
  selector: 'activity-fab',
  templateUrl: 'activity-fab.html'
})
export class ActivityFabComponent {

  isActivitySliderOpened = false;

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider) {}

  onActivitySelected(event: any, selectedActivity: SelectedActivity, fab: FabContainer) {
    this.statusProvider.selectedActivity.next(selectedActivity);
    this.statusProvider.placeSelected.next(undefined);
    this.dataProvider.increaseActivitySearchNumber();
    fab.close();
  }

}
