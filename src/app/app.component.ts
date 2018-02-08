import { HomePage } from './../pages/home/home';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SlideWalkthroughPage } from '../pages/slide-walkthrough/slide-walkthrough';

import { DataProvider } from './../providers/data/data';

import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, dataProvider: DataProvider) {
    moment.locale('it')
    dataProvider.isAppFirstRun()
      .then(value => value ? this.rootPage = SlideWalkthroughPage : this.rootPage = HomePage)
      .catch(_ => this.rootPage = HomePage)
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

