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
  Marker,
  MarkerClusterOptions
} from '@ionic-native/google-maps';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFirestore } from 'angularfire2/firestore';
import * as GeoFire from 'geofire';
import * as GeoLib from 'geolib';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  mapElement: HTMLElement;
  suggestions: string[];
  geoFire: any;
  geoQuery: any;
  markers: {};

  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps,
    public platform: Platform, public autoComplete: AutocompleteProvider,
    public forecast: ForecastProvider, public db: AngularFireDatabase) {
    this.suggestions = [];
  }

  // ionViewDidLoad() {
  //   this.loadMap();
  //  }

  ngAfterViewInit() {
    this.platform.ready().then(_ => {
      this.loadMap()
        .then(_ => {
          this.map.setCompassEnabled(false);
          this.map.on(GoogleMapsEvent.CAMERA_MOVE_END)
            .subscribe(_ => {
              this.updateQuery();
            })
          this.initQueries();
          return this.map.getMyLocation();
        })
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
    });
  }

  loadMap() {
    this.mapElement = document.getElementById('map');
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 40.9221968,
          lng: 14.7907662
        },
        zoom: 16,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);
    // this.map = new GoogleMap(this.mapElement, mapOptions);
    return this.map.one(GoogleMapsEvent.MAP_READY)
  }

  addMarker(lat: number, lng: number, key: string) {
    this.map.addMarker({
      icon: 'assets/icon/sun.png',
      position: {
        lat: lat,
        lng: lng
      }
    }).then(marker => {
      // icon anchor set to the center of the icon
      marker.setIconAnchor(42, 37)
      if (this.markers == undefined)
        this.markers = {}
      this.markers[key] = marker;
      console.log(this.markers)
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

  initQueries() {
    this.geoFire = new GeoFire(this.db.database.ref("/province"));
    var distance = GeoLib.getDistance(
      { latitude: 40.9221968, longitude: 14.7907662 },
      { latitude: this.map.getVisibleRegion().northeast.lat, longitude: this.map.getVisibleRegion().northeast.lng }
    ) / 1000;
    this.geoQuery = this.geoFire.query({
      center: [this.map.getCameraTarget().lat, this.map.getCameraTarget().lng],
      radius: distance
    })
    this.geoQuery.on("key_entered", (key, location, distance) => this.addMarker(location[0], location[1], key));
    this.geoQuery.on("key_exited", (key, location, distance) => {
      try {
        this.markers[key].remove()
      }
      catch(e) {
        console.log(e);
      }
    });
  }

  updateQuery() {
    var distance = GeoLib.getDistance(
      { latitude: this.map.getCameraTarget().lat, longitude: this.map.getCameraTarget().lng },
      { latitude: this.map.getVisibleRegion().northeast.lat, longitude: this.map.getVisibleRegion().northeast.lng }
    ) / 1000;
    this.geoQuery.updateCriteria({
      center: [this.map.getCameraTarget().lat, this.map.getCameraTarget().lng],
      radius: distance
    })
  }
  // getForecast() {
  //   this.afs.collection("forecast").ref.get()
  //     .then(data => {
  //       var markersOptions: MarkerOptions[] = [];
  //       data.forEach(doc => {
  //         console.log(doc.data().coord.latitude)
  //         // this.addMarker(doc.data().coord.latitude, doc.data().coord.longitude)
  //         markersOptions.push({
  //           icon: 'assets/icon/sun.png',
  //           position: {
  //             lat: doc.data().coord.latitude,
  //             lng: doc.data().coord.longitude
  //           }
  //         })
  //       })
  //       this.map.addMarkerCluster({
  //         markers: markersOptions,
  //         icons: [
  //           { min: 2, max: 100, url: "assets/icon/sun.png", anchor: { x: 42, y: 37 } }
  //         ]
  //       })
  //     })
  // }
}
