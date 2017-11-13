import { ForecastProvider } from './../../providers/forecast/forecast';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
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

  constructor(public navCtrl: NavController, public platform: Platform, public autoComplete: AutocompleteProvider,
    public forecast: ForecastProvider, public db: AngularFireDatabase) {
    this.suggestions = [];
  }

  // ionViewDidLoad() {
  //   this.loadMap();
  //  }

  async ngAfterViewInit() {
    await this.platform.ready()
    this.loadMap()
  }

  loadMap() {
    this.map = new google.maps.Map(this.mapDiv.nativeElement, {
      center: { lat: 40.9221968, lng: 14.7776341 },
      zoom: 12,
      disableDefaultUI: true
    });
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
          this.suggestions.push(data[i]);
      })
  }

  suggestionListener(elem: any) {
    this.suggestions.splice(0, this.suggestions.length)
    this.autoComplete.getCoord(elem.place_id)
      .subscribe(data => {
      })
  }
}

