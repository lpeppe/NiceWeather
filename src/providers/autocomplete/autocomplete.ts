import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AutocompleteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutocompleteProvider {

  labelAttribute = "description";

  constructor(public http: Http) {
  }

  getResults(keyword: string) {
    return this.http.get("https://us-central1-niceweather-182807.cloudfunctions.net/autocomplete?keyword=" + keyword)
      .map(result => { return result.json() });
    }
    
    getCoord(placeid: string) {
      return this.http.get("https://us-central1-niceweather-182807.cloudfunctions.net/placeDetails?placeid=" + placeid)
        .map(result => { return result.json() });
      
  }
}
