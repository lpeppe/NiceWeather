import { StatusProvider } from './../../providers/status/status';
import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';
import { SelectedActivity } from '../../models/enums';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { AngularFirestore } from 'angularfire2/firestore';
// declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(
    public platform: Platform,
    private geolocation: Geolocation,
    public statusProvider: StatusProvider,
    private toastCtrl: ToastController,
    public geoQueryProvider: GeoqueryProvider,
    public splashScreen: SplashScreen) { }

  getTimeFabStyle(): string {
    if (this.statusProvider.selectedActivity.getValue() == SelectedActivity.sun)
      return '2vw';
    return 'calc(2vw + 70px)';
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
  }

  async ngAfterViewInit() {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.map.panTo({ lat: resp.coords.latitude, lng: resp.coords.longitude })
    //   this.map.setZoom(14);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    this.geolocation.getCurrentPosition()
      .then(pos => {
        this.statusProvider.mapPosition.next({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          },
          zoom: 12,
          triggerMapMove: true
        })
      })
      .catch(err => console.log(err))
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
}

