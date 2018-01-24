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
import { PopoverPage } from './../pages/popover/popover';

import { AutocompleteProvider } from '../providers/autocomplete/autocomplete';
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
import { GeoFabComponent } from '../components/geo-fab/geo-fab';
import { TimeFabComponent } from '../components/time-fab/time-fab';

import { HammerConfig } from './hammer.config'
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GeoqueryProvider } from '../providers/geoquery/geoquery';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SlideWalkthroughPage,
    PopoverPage,
    AutocompleteComponent,
    MapComponent,
    ActivityFabComponent,
    ActivityListComponent,
    GeoFabComponent,
    TimeFabComponent
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
    SlideWalkthroughPage,
    PopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    AutocompleteProvider,
    Geolocation,
    DataProvider,
    StatusProvider,
    GeoqueryProvider
  ]
})
export class AppModule { }
