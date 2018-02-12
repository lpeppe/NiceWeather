import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LatLng, Review } from './../../models/interfaces';
import { SelectedActivity } from './../../models/enums';
import { StatusProvider } from './../status/status';
import { AuthProvider } from './../auth/auth';
import { getDaysString } from './../../app/utils';
import * as moment from 'moment';
import 'rxjs/add/operator/take';

@Injectable()
export class DataProvider {

  constructor(public storage: Storage, public db: AngularFireDatabase, public http: HttpClient,
    public statusProvider: StatusProvider, public authProvider: AuthProvider) { }

  getSunData(): Promise<any> {
    return Promise.all([this.getSunPoints(), this.getSunForecast()])
  }

  getReviews(): Observable<Review[]> {
    // return new Promise((resolve, reject) => {
    //   let activity = this.statusProvider.selectedActivity.getValue();
    //   let id = this.statusProvider.placeSelected.getValue();
    //   this.db.object(`${SelectedActivity[activity]}/reviews/${id}`).valueChanges().take(1)
    //     .subscribe((data: Review[]) => resolve(data), err => reject(err))
    // })
    let [activity, id] = this.getActivityAndId();
    return this.db.object(`${SelectedActivity[activity]}/reviews/${id}`).valueChanges();
  }

  getActivityDetails(activity: SelectedActivity, id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let data = await this.storage.get(`${activity}-${id}`);
      if (data == null || data == undefined) {
        this.getAndSetRemoteData(`${activity}/details/${id}`, `${activity}-${id}`, false)
          .then(data => resolve(data))
          .catch(err => reject(err))
      }
      else {
        resolve(data);
      }
    })
  }

  getPlaceLatLng(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      let activity = this.statusProvider.selectedActivity.getValue();
      let id = this.statusProvider.placeSelected.getValue();
      this.db.object(`${SelectedActivity[activity]}/points/${id}`).valueChanges().take(1)
        .subscribe((data: LatLng) => resolve(data), err => reject(err))
    })
  }

  getBikePath(): Promise<LatLng[]> {
    return new Promise((resolve, reject) => {
      let id = this.statusProvider.placeSelected.getValue();
      this.db.object(`bike/paths/${id}`).valueChanges().take(1)
        .subscribe((data: LatLng[]) => resolve(data), err => reject(err))
    })
  }

  getNavigatorData(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      let activity = this.statusProvider.selectedActivity.getValue();
      let id = this.statusProvider.placeSelected.getValue();
      if (activity == SelectedActivity.bike)
        this.db.object(`bike/paths/${id}/0`).valueChanges().take(1)
          .subscribe((data: LatLng) => resolve(data), err => reject(err))
      else
        this.db.object(`${SelectedActivity[activity]}/points/${id}`).valueChanges().take(1)
          .subscribe((data: LatLng) => resolve(data), err => reject(err))
    })
  }

  getPhoneNumber(): Promise<string> {
    return new Promise((resolve, reject) => {
      let activity = this.statusProvider.selectedActivity.getValue();
      let id = this.statusProvider.placeSelected.getValue();
      this.db.object(`${SelectedActivity[activity]}/details/${id}/phone`).valueChanges().take(1)
        .subscribe((phone: string) => resolve(phone), err => reject(err))
    })
  }

  increaseActivitySearchNumber(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const activity = SelectedActivity[this.statusProvider.selectedActivity.getValue()];
      if (this.authProvider.loggedIn) {
        const firebasePath = `users/${this.authProvider.userId}/${activity}/searchCounter`;
        try {
          let counter = await this.getSnapShot(firebasePath);
          if (counter == null)
            await this.db.object(firebasePath).set(1);
          else
            await this.db.object(firebasePath).set(++counter)
          resolve();
        }
        catch (err) {
          reject(err)
        }
      }
    })
  }

  getFavouriteActivity(): Promise<SelectedActivity> {
    return new Promise(async (resolve, reject) => {
      if (!this.authProvider.loggedIn)
        resolve(SelectedActivity.ski)
      else {
        let promises = [];
        for (let activity in SelectedActivity)
          if (isNaN(<any>activity))
            promises.push(this.getSnapShot(`users/${this.authProvider.userId}/${activity}/searchCounter`))
        try {
          let values = await Promise.all(promises);
          resolve(values.indexOf(Math.max(...values)));
        }
        catch (err) {
          reject(err)
        }
      }
    })
  }

  addReview(rating: number, text: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let [activity, id] = this.getActivityAndId();
      let nameData = this.authProvider.name.split(" ");
      let review = {
        surname: nameData.pop(),
        name: nameData.toString().replace(/,/g, " "),
        rating,
        review: text,
        pic: this.authProvider.imgUrl,
        date: moment().format('D MMM YYYY')
      }
      await this.db.object(`${SelectedActivity[activity]}/reviews/${id}/${this.authProvider.userId}`).set(review);
      review['activity'] = SelectedActivity[activity];
      await this.db.object(`users/${this.authProvider.userId}/reviews/${id}`).set(review);
      resolve();
    })
  }

  getUserReviews(): Observable<{
    [key: string]:
    {
      activity: string,
      date: string,
      name: string,
      pic: string,
      rating: number,
      review: string,
      surname: string
    }
  }> {
    return this.db.object(`users/${this.authProvider.userId}/reviews`).valueChanges();
  }

  deleteReview(review: {
    id: string,
    activity: string,
    date: string,
    rating: number,
    review: string,
    placeName: string
  }): Promise<any> {
    return Promise.all([
      this.db.object(`users/${this.authProvider.userId}/reviews/${review.id}`).set({}),
      this.db.object(`${review.activity}/reviews/${review.id}/${this.authProvider.userId}`).set({})
    ])
  }

  private getSunPoints(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await this.storage.get('sun-points');
        if (data == null || data[Object.keys(data)[0]][0] == null) {
          this.getAndSetRemoteData('sun/randomPoints', 'sun-points', false)
            .then(data => resolve(data))
            .catch(err => reject(err))
        }
        else
          resolve(data)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  private getSunForecast(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let daysString = getDaysString(this.statusProvider.selectedDays.getValue());
        let data = await this.storage.get(`sun-forecast|${daysString}`);
        let isDataStale = this.isDataStale(moment(await this.storage.get('sun-forecast-date')));
        if (data == null || isDataStale || data == undefined) {
          if (isDataStale) {
            await this.storage.forEach((value, key, iterationNumber) => {
              if (key.includes('sun-forecast'))
                this.storage.remove(key)
            })
          }
          this.getAndSetRemoteData(`sun/sunnyPoints/${daysString}`, `sun-forecast|${daysString}`, true)
            .then(data => resolve(data))
            .catch(err => reject(err))
        }
        else
          resolve(data);
      }
      catch (err) {
        reject(err);
      }
    })
  }

  private getAndSetRemoteData(firebasePath: string, storageKey: string, forecast: boolean): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let db$ = this.db.object(firebasePath).valueChanges().take(1);
      db$.subscribe(data => {
        if (forecast) {
          Promise.all([this.storage.set(storageKey, data), this.storage.set('sun-forecast-date', moment().valueOf())])
            .then(_ => resolve(data))
            .catch(err => reject(err))
        }
        else {
          this.storage.set(storageKey, data)
            .then(_ => resolve(data))
            .catch(err => reject(err))
        }
      }, err => reject(err))
    })
  }

  private isDataStale(date: moment.Moment) {
    return date.dayOfYear() != moment().dayOfYear()
  }

  private getSnapShot(firebasePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.object(firebasePath).valueChanges().take(1)
        .subscribe(data => resolve(data), err => reject(err))
    })
  }

  private getActivityAndId(): [SelectedActivity, string] {
    return [this.statusProvider.selectedActivity.getValue(), this.statusProvider.placeSelected.getValue()];
  }
}
