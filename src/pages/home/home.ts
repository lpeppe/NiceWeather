import { ForecastProvider } from './../../providers/forecast/forecast';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { importType } from '@angular/compiler/src/output/output_ast';
import { Http } from '@angular/http';
import { clusterStyle, customCalculator } from '../../app/cluster-settings';
// import { AngularFirestore } from 'angularfire2/firestore';
declare var google;
declare var MarkerClusterer;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  map: any;
  markerClusterer: any;
  suggestions: string[];
  @ViewChild('map') mapDiv: ElementRef;
  @ViewChild('inputBar') inputBar: ElementRef;

  constructor(public navCtrl: NavController, public platform: Platform, public autoComplete: AutocompleteProvider,
    public forecast: ForecastProvider, public db: AngularFireDatabase, private geolocation: Geolocation,
    public http: Http) {
    this.suggestions = [];
  }

  // ionViewDidLoad() {
  //   this.loadMap();
  //  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap();
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
      zoom: 12,
      disableDefaultUI: true
    });
    this.http.get('assets/centerPoints.json')
      .map(x => { return x.json() })
      .subscribe(data => {
        var markers = [];
        for (let point of data.features) {
          markers.push(new google.maps.Marker({
            position: new google.maps.LatLng(point.geometry.coordinates[1], point.geometry.coordinates[0]),
            map: this.map,
            visible: point.properties.sunny,
            icon: 'assets/images/sun.png'
          }))
        }
        this.markerClusterer = new MarkerClusterer(this.map, markers, { 
          styles: clusterStyle,
          zoomOnClick: false,
          averageCenter: true,
          gridSize: 150
        });
        this.markerClusterer.setCalculator(customCalculator);
        // this.map.data.loadGeoJson(data)
        // this.map.data.addGeoJson(data, null, features => {
        //       var markers = features.map(feature => {
        //           var g = feature.getGeometry();
        //           var marker = new google.maps.Marker({ 'position': g.get(0) });
        //           return marker;
        //       });

        //       var markerCluster = new MarkerClusterer(this.map, markers);
        //   });
      });

  }

  increaseZoom() {
    this.map.setZoom(this.map.getZoom() + 1);
    this.markerClusterer.gridSize_ += 20;
  }
  
  decreaseZoom() {
    this.map.setZoom(this.map.getZoom() -1);
    this.markerClusterer.gridSize_ -= 20;
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

