import { ForecastProvider } from './../../providers/forecast/forecast';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
// import { AngularFirestore } from 'angularfire2/firestore';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  map: any;
  suggestions: string[];
  @ViewChild('map') mapDiv: ElementRef;
  @ViewChild('inputBar') inputBar: ElementRef;

  constructor(public navCtrl: NavController, public platform: Platform, public autoComplete: AutocompleteProvider,
    public forecast: ForecastProvider, public db: AngularFireDatabase, private geolocation: Geolocation) {
    this.suggestions = [];
  }

  // ionViewDidLoad() {
  //   this.loadMap();
  //  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.map.panTo({lat: resp.coords.latitude, lng: resp.coords.longitude})
      this.map.setZoom(14);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  loadMap() {
    this.map = new google.maps.Map(this.mapDiv.nativeElement, {
      center: { lat: 40.9221968, lng: 14.7776341 },
      zoom: 12,
      disableDefaultUI: true
    });
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
        this.map.panTo({lat: data.lat, lng: data.lng})
        this.map.setZoom(14);
      }, err => console.log(err))
  }
}

