import { LatLng } from './../../models/interfaces';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectedDay, SelectedActivity } from './../../models/enums';


@Injectable()
export class StatusProvider {

  selectedDay = new BehaviorSubject<SelectedDay>(SelectedDay.today);
  selectedActivity = new BehaviorSubject<SelectedActivity>(SelectedActivity.sun);
  isSearchMode = new BehaviorSubject<boolean>(false);

  // used by the autocomplete component when a suggestion is pressed
  placeSelected = new Subject<LatLng>();

  activitySearched = new Subject<void>();

  activityFabOpened = new BehaviorSubject<boolean>(false);
  
  areaFabOpened = new BehaviorSubject<boolean>(false);
}
