import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { StatusProvider } from './../status/status';
import { SelectedActivity } from './../../models/enums';
import { LatLng } from './../../models/interfaces';

import * as GeoFire from 'geofire';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GeoqueryProvider {

  keyEntered = new Subject<{ [key: string]: LatLng }>();
  keyExited = new Subject<{ [key: string]: LatLng }>();
  geoQuery: any;

  constructor(public statusProvider: StatusProvider, public db: AngularFireDatabase) {
    this.statusProvider.selectedActivity.subscribe(activity => {
      if (activity != SelectedActivity.sun) {
        this.setQuery(activity);
        this.setListeners();
      }
    })
    
    this.statusProvider.selectedDay.subscribe(_ => {
      let activity = this.statusProvider.selectedActivity.getValue();
      if (activity != SelectedActivity.sun) {
        this.setQuery(activity);
        this.setListeners();
      }
    })

    this.statusProvider.mapPosition.subscribe(mapData => {
      if (this.statusProvider.selectedActivity.getValue() != SelectedActivity.sun && this.geoQuery) {
        this.geoQuery.updateCriteria({
          center: [mapData.coords.lat, mapData.coords.lng],
          radius: this.statusProvider.mapRadius
        })
      }
    })
  }

  setQuery(activity: SelectedActivity) {
    let geoFireRef = new GeoFire(this.db
      .list(`newdb/${SelectedActivity[activity]}/suitablePoints/${this.statusProvider.selectedDay.getValue()}`).query.ref)
    let mapPosition = this.statusProvider.mapPosition.getValue().coords;
    if (this.geoQuery)
      this.geoQuery.cancel();
    this.geoQuery = geoFireRef.query({
      center: [mapPosition.lat, mapPosition.lng],
      radius: this.statusProvider.mapRadius
    })
  }

  setListeners() {
    this.geoQuery.on('key_entered', (key, location, distance) => {
      let toEmit = {};
      toEmit[key] = {
        lat: location[0],
        lng: location[1]
      };
      this.keyEntered.next(toEmit);
    })
    this.geoQuery.on("key_exited", (key, location, distance) => {
      let toEmit = {};
      toEmit[key] = {
        lat: location[0],
        lng: location[1]
      };
      this.keyExited.next(toEmit);
    })
  }

  ngOnDestroy() {
    this.statusProvider.selectedActivity.unsubscribe();
    this.statusProvider.selectedDay.unsubscribe();
    this.statusProvider.selectedDay.unsubscribe();
  }
}
