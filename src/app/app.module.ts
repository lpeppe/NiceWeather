import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PopoverPage } from './../pages/popover/popover';
import { MapCustomizationPage } from './../pages/map-customization/map-customization';
import { WriteReviewPage } from './../pages/write-review/write-review';
import { UserReviewsPage } from './../pages/user-reviews/user-reviews';
import { UserFavouritesPage } from '../pages/user-favourites/user-favourites';

import { AutocompleteProvider } from '../providers/autocomplete/autocomplete';
import { StatusProvider } from '../providers/status/status';
import { DataProvider } from '../providers/data/data';
import { AuthProvider } from '../providers/auth/auth';
import { GeoqueryProvider } from '../providers/geoquery/geoquery';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
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
import { ActivityButtonPanelComponent } from './../components/activity-button-panel/activity-button-panel';

import { HammerConfig } from './hammer.config'
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { BikeDetailsListComponent } from '../components/bike-details-list/bike-details-list';
import { SkiDetailsListComponent } from './../components/ski-details-list/ski-details-list';
import { SeaDetailsListComponent } from './../components/sea-details-list/sea-details-list';
import { BikeDetailsComponent } from '../components/bike-details/bike-details';
import { ReviewsComponent } from '../components/reviews/reviews';
import { SideMenuComponent } from '../components/side-menu/side-menu';
import { SeaDetailsComponent } from './../components/sea-details/sea-details';
import { SkiDetailsComponent } from './../components/ski-details/ski-details';

import { SkiDetailsPipe } from './../pipes/ski-details/ski-details';
import { BikeDetailsPipe } from './../pipes/bike-details/bike-details';

import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PopoverPage,
    MapCustomizationPage,
    WriteReviewPage,
    UserReviewsPage,
    UserFavouritesPage,
    AutocompleteComponent,
    MapComponent,
    ActivityFabComponent,
    ActivityListComponent,
    GeoFabComponent,
    TimeFabComponent,
    BikeDetailsListComponent,
    SkiDetailsListComponent,
    SeaDetailsListComponent,
    BikeDetailsComponent,
    SkiDetailsComponent,
    SeaDetailsComponent,
    ReviewsComponent,
    SideMenuComponent,
    ActivityButtonPanelComponent,
    BikeDetailsPipe,
    SkiDetailsPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    // AngularFirestoreModule
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PopoverPage,
    MapCustomizationPage,
    WriteReviewPage,
    UserReviewsPage,
    UserFavouritesPage
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
    GeoqueryProvider,
    LaunchNavigator,
    CallNumber,
    AuthProvider,
    GooglePlus
  ]
})
export class AppModule { }
