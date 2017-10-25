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
const maxzoom = 14;
const minzoom = 5.5;
const hcThreshold = 7;
const provinceThreshold = 13;
const enum ZoomLevels {
  comuni,
  province,
  hardCoded
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  map: GoogleMap;
  mapElement: HTMLElement;
  suggestions: string[];
  // geoQueries: {
  //   hc: any,
  //   province: any,
  //   comuni: any
  // };
  geoQueries: {};
  // geoQueryP: any;
  // geoQueryHC: any;
  // geoQueryC: any;
  markers: {};
  geoFireInstances: {}
  // geoFireP: any;
  // geoFireC: any;
  // geoFireHC: any;
  zoomLevel: ZoomLevels;

  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps,
    public platform: Platform, public autoComplete: AutocompleteProvider,
    public forecast: ForecastProvider, public db: AngularFireDatabase) {
    this.suggestions = [];
    this.markers = {};
    this.geoQueries = {};
    this.geoFireInstances = {};
  }

  // ionViewDidLoad() {
  //   this.loadMap();
  //  }

  ngAfterViewInit() {
    this.platform.ready().then(_ => {
      this.loadMap()
        .then(_ => {
          this.initGeoFire();
          this.initQuery(this.getZoomLevel(this.map.getCameraPosition().zoom));
          this.map.setCompassEnabled(false);
          this.map.on(GoogleMapsEvent.CAMERA_MOVE_END)
            .subscribe(_ => {
              var newZoomLevel = this.getZoomLevel(this.map.getCameraPosition().zoom);
              if (this.zoomLevel != newZoomLevel) {
                if (this.geoQueries[newZoomLevel] == undefined)
                  this.initQuery(newZoomLevel);
                this.map.clear();
                this.markers = {};
                this.zoomLevel = newZoomLevel;
              }
              this.updateQuery(this.geoQueries[newZoomLevel]);
            })
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
            zoom: minzoom,
            tilt: 30
          };
          this.map.moveCamera(position);
          this.zoomLevel = minzoom;
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
        zoom: maxzoom,
        tilt: 30
      },
      preferences: {
        zoom: {
          minZoom: minzoom,
          maxZoom: maxzoom
        }
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);
    this.zoomLevel = maxzoom;
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
      marker.setIconAnchor(42, 37);
      this.markers[key] = marker;
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

  initQuery(zoomLevel: ZoomLevels) {
    var cameraTarget = [this.map.getCameraTarget().lat, this.map.getCameraTarget().lng];
    var distance = GeoLib.getDistance(
      { latitude: cameraTarget[0], longitude: cameraTarget[1] },
      { latitude: this.map.getVisibleRegion().northeast.lat, longitude: this.map.getVisibleRegion().northeast.lng }
    ) / 1000;
    this.geoQueries[zoomLevel] = this.createQuery(this.geoFireInstances[zoomLevel], cameraTarget, distance);
  }

  createQuery(geoFire: any, center: number[], distance: number) {
    var toReturn = geoFire.query({
      center: [center[0], center[1]],
      radius: distance
    })
    toReturn.on("key_entered", (key, location, distance) => this.addMarker(location[0], location[1], key));
    toReturn.on("key_exited", (key, location, distance) => {
      try {
        if(this.markers[key] != undefined) {
          this.markers[key].remove()
          delete this.markers[key];
        }
      }
      catch (e) {
        console.log(e);
      }
    });
    return toReturn;
  }

  updateQuery(query: any) {
    var distance = GeoLib.getDistance(
      { latitude: this.map.getCameraTarget().lat, longitude: this.map.getCameraTarget().lng },
      { latitude: this.map.getVisibleRegion().northeast.lat, longitude: this.map.getVisibleRegion().northeast.lng }
    ) / 1000;
    // this.geoQueryP.updateCriteria({
    //   center: [this.map.getCameraTarget().lat, this.map.getCameraTarget().lng],
    //   radius: distance
    // })
    // this.geoQueryHC.updateCriteria({
    //   center: [this.map.getCameraTarget().lat, this.map.getCameraTarget().lng],
    //   radius: distance
    // })
    // this.geoQueryC.updateCriteria({
    //   center: [this.map.getCameraTarget().lat, this.map.getCameraTarget().lng],
    //   radius: distance
    // })
    query.updateCriteria({
      center: [this.map.getCameraTarget().lat, this.map.getCameraTarget().lng],
      radius: distance
    })
  }

  initGeoFire() {
    // this.geoFireInstances = {
    //   ZoomLevels.province: new GeoFire(this.db.database.ref("/province")),
    //   comuni: new GeoFire(this.db.database.ref("/comuni")),
    //   hc: new GeoFire(this.db.database.ref("/hc"))
    // }
    this.geoFireInstances[ZoomLevels.province] = new GeoFire(this.db.database.ref("/province"));
    this.geoFireInstances[ZoomLevels.comuni] = new GeoFire(this.db.database.ref("/comuni"));
    this.geoFireInstances[ZoomLevels.hardCoded] = new GeoFire(this.db.database.ref("/hc"));
  }

  getZoomLevel(zoom: number): ZoomLevels {
    if (zoom <= hcThreshold)
      return ZoomLevels.hardCoded;
    else if (zoom <= provinceThreshold)
      return ZoomLevels.province;
    return ZoomLevels.comuni;
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

