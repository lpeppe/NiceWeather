import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';


/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(public storage: Storage, public db: AngularFireDatabase) {

  }

  getSunData(): Promise<any> {
    return Promise.all([this.getSunPoints(), this.getSunForecast()])
  }

  private async getSunPoints(): Promise<any> {
    let data = await this.storage.get('sun-points');
    if (data == null)
      return this.getAndSetRemoteData('sun/points', 'sun-points')
    return new Promise((resolve, reject) => resolve(data))
  }

  private async getSunForecast(): Promise<any> {
    let data = await this.storage.get('sun-forecast');
    if (data == null || this.calcDateDiffInDays(data.date, new Date()) >= 1)
      return this.getAndSetRemoteData('sun/forecast', 'sun-forecast')
    return new Promise((resolve, reject) => resolve(data))
  }

  private getAndSetRemoteData(firebasePath: string, storageKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.object(firebasePath).valueChanges().subscribe(data => {
        data['date'] = new Date();
        this.storage.set(storageKey, data)
          .then(_ => resolve(data))
          .catch(err => reject(err))
      }, err => reject(err))
    })
  }

  private calcDateDiffInDays(date1: Date, date2: Date): number {
    return Math.floor((Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) - Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())) / (1000 * 60 * 60 * 24));
  }
}
