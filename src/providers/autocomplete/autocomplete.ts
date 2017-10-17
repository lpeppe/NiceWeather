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
    return this.http.get("http://192.168.1.107:8082?keyword=" + keyword)
      .map(result => { return result.json() });
  }
}
