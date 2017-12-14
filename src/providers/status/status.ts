import { LatLng } from './../../app/interfaces';
import { Injectable, EventEmitter } from '@angular/core';

/*
  Generated class for the StatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatusProvider {

  placeSelected = new EventEmitter<LatLng>();

}
