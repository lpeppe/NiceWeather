import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusProvider } from './../../providers/status/status';

@Component({
  selector: 'geo-fab',
  templateUrl: 'geo-fab.html'
})
export class GeoFabComponent {


  constructor(public geolocation: Geolocation, public statusProvider: StatusProvider) { }

  onClick(event: any) {
    this.geolocation.getCurrentPosition()
      .then(pos => {
        this.statusProvider.mapPosition.next({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          },
          zoom: 12,
          triggerMapMove: true
        })
      })
      .catch(err => console.log(err))
  }

}
