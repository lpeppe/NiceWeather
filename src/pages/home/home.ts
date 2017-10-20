import { ForecastProvider } from './../../providers/forecast/forecast';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  mapElement: HTMLElement;
  suggestions: string[];

  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps,
    public platform: Platform, public autoComplete: AutocompleteProvider,
    public forecast: ForecastProvider) {
    this.suggestions = [];
  }

  // ionViewDidLoad() {
  //   this.loadMap();
  //  }

  ngAfterViewInit() {
    this.platform.ready().then(_ => {
      this.loadMap();
    });
  }

  loadMap() {
    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      // camera: {
      //   target: {
      //     lat: 43.0741904,
      //     lng: -89.3809802
      //   },
      //   zoom: 18,
      //   tilt: 30
      // }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);
    // this.map = new GoogleMap(this.mapElement, mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(_ => {
        this.forecast.getForecast()
          .subscribe(data => {
            console.log(data)
            for (var i in data.citta) {
              if (data.citta[i].forecast == 'Clear')
                this.addMarker(data.citta[i].coordinate.lat, data.citta[i].coordinate.lng);
            }
          })
        this.map.setCompassEnabled(false);
        this.map.getMyLocation()
          .then(location => {
            let lat = location.latLng.lat;
            let lng = location.latLng.lng;
            let position: CameraPosition<any> = {
              target: {
                lat: lat,
                lng: lng
              },
              zoom: 18,
              tilt: 30
            };
            this.map.moveCamera(position);
          })
          .catch(err => console.log("GPS disattivato"))
      })
  }

  addMarker(lat: number, lng: number) {
    this.map.addMarker({
      icon: 'assets/icon/sun.png',
      position: {
        lat: lat,
        lng: lng
      }
    }).then(marker => {
      // icon anchor set to the center of the icon
      marker.setIconAnchor(42, 37)
    })
  }

  searchPlaces(event: any) {
    if (event.data == null) {
      this.suggestions.splice(0, this.suggestions.length);
      return;
    }
    this.autoComplete.getResults(event.data)
      .subscribe(data => {
        this.suggestions.splice(0, this.suggestions.length);
        for (var i in data)
          this.suggestions.push(data[i].description);
      })
  }
}
