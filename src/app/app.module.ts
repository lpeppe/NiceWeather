import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AutocompleteProvider } from '../providers/autocomplete/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { ForecastProvider } from '../providers/forecast/forecast';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../environment';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { DataProvider } from '../providers/data/data';
import { IonicStorageModule } from '@ionic/storage';
import { AutocompleteComponent } from './../components/autocomplete/autocomplete';
import { MapComponent } from './../components/map/map';
import { StatusProvider } from '../providers/status/status';
import { ActivityFabComponent } from '../components/activity-fab/activity-fab';
import { SlideWalkthroughPage } from './../pages/slide-walkthrough/slide-walkthrough';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SlideWalkthroughPage,
    AutocompleteComponent,
    MapComponent,
    ActivityFabComponent,
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
