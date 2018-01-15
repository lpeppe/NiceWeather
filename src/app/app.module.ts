import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SlideWalkthroughPage } from './../pages/slide-walkthrough/slide-walkthrough';

import { AutocompleteProvider } from '../providers/autocomplete/autocomplete';
import { ForecastProvider } from '../providers/forecast/forecast';
import { StatusProvider } from '../providers/status/status';
import { DataProvider } from '../providers/data/data';

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../environment';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicStorageModule } from '@ionic/storage';

import { AutocompleteComponent } from './../components/autocomplete/autocomplete';
import { MapComponent } from './../components/map/map';
import { ActivityFabComponent } from '../components/activity-fab/activity-fab';
import { ActivityListComponent } from './../components/activity-list/activity-list';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SlideWalkthroughPage,
    AutocompleteComponent,
    MapComponent,
    ActivityFabComponent,
    ActivityListComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    // AngularFirestoreModule
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SlideWalkthroughPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AutocompleteProvider,
    ForecastProvider,
    Geolocation,
    DataProvider,
    StatusProvider
  ]
})
export class AppModule {}
