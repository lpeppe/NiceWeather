import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { StatusProvider } from './../status/status';
import { SelectedActivity } from './../../models/enums';
import { LatLng } from './../../models/interfaces';
import { getDaysString } from './../../app/utils';

import * as GeoFire from 'geofire';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class GeoqueryProvider implements OnDestroy {

  keyEntered = new Subject<{ [key: string]: LatLng }>();
  keyExited = new Subject<{ [key: string]: LatLng }>();
  geoQuery: any;
  subscriptions: Subscription[];

  constructor(public statusProvider: StatusProvider, public db: AngularFireDatabase) {
    this.subscriptions = [];
    this.subscriptions.push(
      this.statusProvider.selectedActivity
        .subscribe(activity => {
          if (activity != SelectedActivity.sun) {
            this.setQuery(activity);
            this.setListeners();
          }
        })
    )

    this.subscriptions.push(
      this.statusProvider.selectedDays
        .subscribe(_ => {
          let activity = this.statusProvider.selectedActivity.getValue();
          if (activity != SelectedActivity.sun) {
            this.setQuery(activity);
            this.setListeners();
          }
        })
    )

    this.subscriptions.push(
      // subscription is delayed so that the mapRadius value is refreshed correctly by the map component
      this.statusProvider.mapPosition.delay(10)
        .subscribe(mapData => {
          if (this.statusProvider.selectedActivity.getValue() != SelectedActivity.sun && this.geoQuery) {
            this.geoQuery.updateCriteria({
              center: [mapData.coords.lat, mapData.coords.lng],
              radius: this.statusProvider.mapRadius
            })
          }
        })
    )
  }

  setQuery(activity: SelectedActivity) {
    let geoFireRef = new GeoFire(this.db
      .list(`${SelectedActivity[activity]}/suitablePoints/${getDaysString(this.statusProvider.selectedDays.getValue())}`).query.ref)
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
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }
}
