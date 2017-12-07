import { DataProvider } from './../../providers/data/data';
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

  map: google.maps.Map;
  markerClusterer: any;
  suggestions: string[];
  @ViewChild('map') mapDiv: ElementRef;
  @ViewChild('inputBar') inputBar: ElementRef;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public autoComplete: AutocompleteProvider,
    public db: AngularFireDatabase,
    private geolocation: Geolocation,
    public dataProvider: DataProvider) {
    this.suggestions = [];
  }

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
      center: { lat: 43.0221968, lng: 13.2776341 },
      zoom: 6,
      disableDefaultUI: true,
      minZoom: 6,
      maxZoom: 10
    });
  }

  async loadMarkersData() {
    return new Promise(async (resolve, reject) => {
      try {
        let [points, forecast] = await this.dataProvider.getSunData();
        let markers = [];
        for (let id in points) {
          let latlng = points[id];
          markers.push(new google.maps.Marker({
            position: new google.maps.LatLng(latlng.lat, latlng.lng),
            map: this.map,
            visible: forecast[id].sunny,
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

