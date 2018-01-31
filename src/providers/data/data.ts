import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LatLng } from './../../models/interfaces';
import { StatusProvider } from './../status/status';
import { getDaysString } from './../../app/utils';
import * as moment from 'moment';
import 'rxjs/add/operator/take';

@Injectable()
export class DataProvider {

  constructor(public storage: Storage, public db: AngularFireDatabase, public http: HttpClient,
    public statusProvider: StatusProvider) { }

  isAppFirstRun(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      resolve(await this.storage.get('sun-points') == null)
    })
  }

  getSunData(): Promise<any> {
    return Promise.all([this.getSunPoints(), this.getSunForecast()])
  }

  private async getSunPoints(): Promise<any> {
    let data = await this.storage.get('sun-points');
    if (data == null)
      return this.getAndSetRemoteData('sun/randomPoints', 'sun-points')
    return new Promise((resolve, reject) => resolve(data))
  }

  private async getSunForecast(): Promise<any> {
    let daysString = getDaysString(this.statusProvider.selectedDays.getValue());
    let data = await this.storage.get(`sun-forecast|${daysString}`);
    if (data == null || this.isDataStale(moment(await this.storage.get('sun-forecast-date'))))
      return this.getAndSetRemoteData(`sun/sunnyPoints/${daysString}`, `sun-forecast|${daysString}`)
    return new Promise((resolve, reject) => resolve(data))
  }

  private getAndSetRemoteData(firebasePath: string, storageKey: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.storage.clear();
      let db$ = this.db.object(firebasePath).valueChanges().take(1);
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
