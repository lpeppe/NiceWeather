import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ForecastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ForecastProvider {

  constructor(public http: Http) {
    console.log('Hello ForecastProvider Provider');
  }

  getForecast() {
    return this.http.get("http://172.19.44.194:4000/weather").map(result => { return result.json() });
  }

}
