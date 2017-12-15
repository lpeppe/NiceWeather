import { LatLng } from './../../app/interfaces';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/*
  Generated class for the StatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatusProvider {

  placeSelected = new Subject<LatLng>();
  activityMenuOpened = new Subject<boolean>();
  rangeChanged = new Subject<number>();
  activitySearched = new Subject<void>();

}
