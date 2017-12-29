import { LatLng } from './../../models/interfaces.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectedDay, SelectedActivity } from './../../models/enums.model';


@Injectable()
export class StatusProvider {

  selectedDay = new BehaviorSubject<SelectedDay>(0);
  selectedActivity = new BehaviorSubject<SelectedActivity>(0);
  placeSelected = new Subject<LatLng>();
  activitySliderOpened = new Subject<boolean>();
  rangeChanged = new Subject<number>();
  activitySearched = new Subject<void>();

}
