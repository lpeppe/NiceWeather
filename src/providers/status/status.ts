import { LatLng } from './../../app/interfaces';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class StatusProvider {

  //next value is emitted when the user clicks on and autocomplete item
  placeSelected = new Subject<LatLng>();

  //next value is emitted when the user opens the fablist
  activityMenuOpened = new Subject<boolean>();

  //next value is emitted on the slider blur event
  rangeChanged = new Subject<number>();

  //next value is emitted when an activity is searched
  activitySearched = new Subject<void>();

  //next value is emitted when the activity data is found
  activityFound = new Subject<void>();

}
