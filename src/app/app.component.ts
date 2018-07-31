import { HomePage } from './../pages/home/home';
import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { DataProvider } from './../providers/data/data';

import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar,
    dataProvider: DataProvider, private alertCtrl: AlertController) {
    moment.locale('it')
    this.rootPage = HomePage;
    platform.ready().then(() => {
      let alert = this.alertCtrl.create({
        title: 'Attenzione',
        subTitle: 'Questa è una versione demo, le previsioni non sono aggiornate!',
        buttons: ['Chiudi']
      });
      alert.present();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
    });
  }
}

