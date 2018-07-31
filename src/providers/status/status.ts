import { LatLng } from './../../models/interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectedActivity } from './../../models/enums';
import * as moment from 'moment';


@Injectable()
export class StatusProvider {
  mapRadius: number;
  toggleValues = new BehaviorSubject<boolean[]>([true, true, true]);
  favouritesMode = new BehaviorSubject<boolean>(false);
  // selectedDays = new BehaviorSubject<number[]>([moment()
  //   .set({
  //     millisecond: 0,
  //     second: 0,
  //     minute: 0,
  //     hour: 13
  //   }).unix()]);
  selectedDays = new BehaviorSubject<number[]>([1526990400]);

  selectedActivity = new BehaviorSubject<SelectedActivity>(SelectedActivity.sun);

  mapPosition = new BehaviorSubject<{ coords: LatLng, zoom?: number, triggerMapMove: boolean }>({
    coords: {
      lat: 41.10832999732831,
      lng: 14.633789062500002
    },
    zoom: 8,
    triggerMapMove: false
  });

  placeSelected = new BehaviorSubject<string>(undefined);

}
