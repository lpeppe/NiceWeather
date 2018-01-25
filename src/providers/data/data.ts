import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LatLng } from './../../models/interfaces';
import * as moment from 'moment';

@Injectable()
export class DataProvider {

  skiStations$: Observable<any>;

  constructor(public storage: Storage, public db: AngularFireDatabase, public http: HttpClient) {
    this.skiStations$ = new Observable<any>();
  }

  isAppFirstRun(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      resolve(await this.storage.get('sun-points') == null)
    })
  }

  getSkiStations(center: LatLng, radius: number): Observable<any> {
    let url = 'https://us-central1-niceweather-182807.cloudfunctions.net/geoQuery';
    this.skiStations$ = this.http.get(`${url}?type=ski&lat=${center.lat}&lng=${center.lng}&radius=${radius}`);
    return this.skiStations$;
  }

  getSunData(): Promise<any> {
    return Promise.all([this.getSunPoints(), this.getSunForecast()])
  }

  private async getSunPoints(): Promise<any> {
    let data = await this.storage.get('sun-points');
    if (data == null)
      return this.getAndSetRemoteData('newdb/sun/randomPoints', 'sun-points')
    return new Promise((resolve, reject) => resolve(data))
  }

  private async getSunForecast(): Promise<any> {
    let data = await this.storage.get('sun-forecast');
    if (data == null || this.isDataStale(moment(await this.storage.get('sun-forecast-date'))))
      return this.getAndSetRemoteData('newdb/sun/sunnyPoints', 'sun-forecast')
    return new Promise((resolve, reject) => resolve(data))
  }

  private getAndSetRemoteData(firebasePath: string, storageKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('in')
      let db$ = this.db.object(firebasePath).valueChanges();
      db$.subscribe(data => {
        Promise.all([this.storage.set(storageKey, data), this.storage.set(`${storageKey}-date`, moment().valueOf())])
          .then(_ => resolve(data))
          .catch(err => reject(err))
      }, err => reject(err))
    })
  }

  private isDataStale(date: moment.Moment) {
    return date.dayOfYear() != moment().dayOfYear()
  }
}
