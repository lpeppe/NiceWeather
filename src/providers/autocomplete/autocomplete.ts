import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AutoCompleteService } from 'ionic2-auto-complete';
import 'rxjs/add/operator/map';

/*
  Generated class for the AutocompleteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutocompleteProvider implements AutoCompleteService {

  labelAttribute = "description";

  constructor(public http: Http) {
    console.log('Hello AutocompleteProvider Provider');
  }

  getResults(keyword: string) {
    console.log(keyword)
    return this.http.get("https://us-central1-niceweather-182807.cloudfunctions.net/autocomplete?keyword=" + keyword)
      .map(result => { return result.json() });
  }
}
