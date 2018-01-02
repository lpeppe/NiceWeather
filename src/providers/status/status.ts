import { LatLng } from './../../models/interfaces';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectedDay, SelectedActivity } from './../../models/enums';


@Injectable()
export class StatusProvider {

  selectedDay = new BehaviorSubject<SelectedDay>(SelectedDay.today);
  selectedActivity = new BehaviorSubject<SelectedActivity>(SelectedActivity.sun);
  placeSelected = new Subject<LatLng>();
  activityPressed = new Subject<void>();
  activitySearched = new Subject<void>();

}
