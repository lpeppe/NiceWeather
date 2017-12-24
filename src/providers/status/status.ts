import { LatLng } from './../../app/interfaces';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

enum SelectedDay {
  today,
  tomorrow
}

@Injectable()
export class StatusProvider {

  selectedDay: SelectedDay = 0;
  placeSelected = new Subject<LatLng>();
  activityMenuOpened = new Subject<boolean>();
  rangeChanged = new Subject<number>();
  activitySearched = new Subject<void>();

}
