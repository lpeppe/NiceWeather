import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { importType } from '@angular/compiler/src/output/output_ast';
import { Http } from '@angular/http';
import { clusterStyle, customCalculator, computeGridSize } from '../../app/cluster-settings';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import { AngularFirestore } from 'angularfire2/firestore';
// declare var google;
declare var MarkerClusterer;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  map: any;
  markerClusterer: any;
  suggestions: string[];
  forecastPromise: Promise<any>;
  pointsPromise: Promise<any>;
  @ViewChild('map') mapDiv: ElementRef;
  @ViewChild('inputBar') inputBar: ElementRef;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public autoComplete: AutocompleteProvider,
    public db: AngularFireDatabase,
    private geolocation: Geolocation,
    public http: Http) {
    this.suggestions = [];

    this.forecastPromise = new Promise((resolve, reject) => {
      db.object('forecast').valueChanges().subscribe(data => resolve(data), err => reject(err))
    })

    this.pointsPromise = new Promise((resolve, reject) => {
      db.object('points').valueChanges().subscribe(data => resolve(data), err => reject(err))
    })
  }

  // ionViewDidLoad() {
  //   this.loadMap();
  //  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap();
    this.createMarkerClusterer(await this.loadMarkersData());

    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.map.panTo({ lat: resp.coords.latitude, lng: resp.coords.longitude })
    //   this.map.setZoom(14);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }

  loadMap() {
    this.map = new google.maps.Map(this.mapDiv.nativeElement, {
      center: { lat: 40.9221968, lng: 14.7776341 },
      zoom: 7,
      disableDefaultUI: true
    });
  }

  async loadMarkersData() {
    return new Promise(async (resolve, reject) => {
      try {
        let values = await Promise.all([this.pointsPromise, this.forecastPromise]);
        let markers = [];
        for (let id in values[0]) {
          let latlng = values[0][id];
          markers.push(new google.maps.Marker({
            position: new google.maps.LatLng(latlng.lat, latlng.lng),
            map: this.map,
            visible: values[1][id].sunny,
            icon: 'assets/images/sun.png'
          }))
        }
        resolve(markers);
      }
      catch (err) {
        console.log(err)
      }
    })
  }

  createMarkerClusterer(markers) {
    this.markerClusterer = new MarkerClusterer(this.map, markers, {
      styles: clusterStyle,
      zoomOnClick: false,
      averageCenter: true,
      gridSize: computeGridSize(this.map.getZoom())
    });
    this.markerClusterer.setCalculator(customCalculator);
    this.map.addListener('zoom_changed', _ => this.markerClusterer.gridSize_ = computeGridSize(this.map.getZoom()))
  }

  changeZoom(step: number) {
    this.map.setZoom(this.map.getZoom() + step);
  }

  searchPlaces(event: any) {
    if (event.srcElement.value == null) {
      this.suggestions.splice(0, this.suggestions.length);
      return;
    }
    this.autoComplete.getResults(event.srcElement.value)
      .subscribe(data => {
        this.suggestions.splice(0, this.suggestions.length);
        for (var i in data)
          this.suggestions.push(data[i]);
      })
  }

  suggestionListener(elem: any) {
    this.suggestions.splice(0, this.suggestions.length)
    this.autoComplete.getCoord(elem.place_id)
      .subscribe(data => {
        this.map.panTo({ lat: data.lat, lng: data.lng })
        this.map.setZoom(14);
      }, err => console.log(err))
  }
}

