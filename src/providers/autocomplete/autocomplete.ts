import { LatLng } from './../../app/interfaces';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AutocompleteProvider {

  labelAttribute = "description";

  constructor(public http: HttpClient) {
  }

  getResults(keyword: string) {
    return this.http.get("https://us-central1-niceweather-182807.cloudfunctions.net/autocomplete?keyword=" + keyword)
    }
    
    getCoord(placeid: string): Observable<LatLng> {
      return <Observable<LatLng>>this.http.get("https://us-central1-niceweather-182807.cloudfunctions.net/placeDetails?placeid=" + placeid)
      
  }
}
