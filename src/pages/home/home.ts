import { StatusProvider } from './../../providers/status/status';
import { DataProvider } from './../../providers/data/data';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform, ToastController } from 'ionic-angular';
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
    public statusProvider: StatusProvider,
    private toastCtrl: ToastController) {
  }

  async ngAfterViewInit() {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.map.panTo({ lat: resp.coords.latitude, lng: resp.coords.longitude })
    //   this.map.setZoom(14);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    await this.platform.ready();
    // window['isUpdateAvailable']
    //   .then(isAvailable => {
    //     if (isAvailable) {
    //       const toast = this.toastCtrl.create({
    //         message: 'New Update available! Reload the webapp to see the latest juicy changes.',
    //         position: 'bottom',
    //         showCloseButton: true,
    //       });
    //       toast.present();
    //     }
    //   });
  }

  // onFabClick(): void {
  //   if(this.map.hasLayer(this.markers)) {
  //     this.map.removeLayer(this.markers)
  //     this.map.addLayer(this.searchCircle);
  //   }
  //   else {
  //     this.map.removeLayer(this.searchCircle)
  //     this.map.addLayer(this.markers)
  //   }  
  // }

  // onRangeChanged(event: any): void {
  //   this.searchCircle.setRadius(event._value * 1000)
  // }

  // onRangeBlur(event: any): void {
  //   this.dataProvider.getSkiStations(this.map.getCenter(), event._value)
  //   .subscribe(data => {
  //     console.log(data)
  //     this.activityMarkers.clearLayers();
  //     for(let point of data)
  //       this.activityMarkers.addLayer(new L.Marker((point), {icon: skiIcon}))
  //     this.map.addLayer(this.activityMarkers)  
  //   })
  // }
}

