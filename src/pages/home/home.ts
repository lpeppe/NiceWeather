import { StatusProvider } from './../../providers/status/status';
import { DataProvider } from './../../providers/data/data';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { importType } from '@angular/compiler/src/output/output_ast';
// import { AngularFirestore } from 'angularfire2/firestore';
// declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public autoComplete: AutocompleteProvider,
    public db: AngularFireDatabase,
    private geolocation: Geolocation,
    public dataProvider: DataProvider,
    public statusProvider: StatusProvider) {
    }
  
  async ngAfterViewInit() {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.map.panTo({ lat: resp.coords.latitude, lng: resp.coords.longitude })
    //   this.map.setZoom(14);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }
}

