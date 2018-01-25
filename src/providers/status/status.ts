import { LatLng } from './../../models/interfaces';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectedActivity } from './../../models/enums';
import * as moment from 'moment';


@Injectable()
export class StatusProvider {
  mapRadius: number;
  selectedDay = new BehaviorSubject<number>(moment()
  .set({
    millisecond: 0,
    second: 0,
    minute: 0,
    hour: 13
  }).unix());

  selectedActivity = new BehaviorSubject<SelectedActivity>(SelectedActivity.sun);

  mapPosition = new BehaviorSubject<{ coords: LatLng, zoom?: number, triggerMapMove: boolean }>({
    coords: {
      lat: 41.10832999732831,
      lng: 14.633789062500002
    },
    zoom: 8,
    triggerMapMove: false
  });
  
  activitySearched = new Subject<void>();
}
