import { LatLng } from './../../models/interfaces';
import { StatusProvider } from './../../providers/status/status';
import { Component } from '@angular/core';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';

@Component({
  selector: 'autocomplete',
  templateUrl: 'autocomplete.html',
})
export class AutocompleteComponent {

  suggestions: string[] = [];

  constructor(public autoComplete: AutocompleteProvider, public statusProvider: StatusProvider) { }

  searchPlaces(event: any): void {
    if (event.srcElement.value == null) {
      this.suggestions.splice(0, this.suggestions.length);
      return;
    }
    this.autoComplete.getResults(event.srcElement.value)
      .subscribe(data => {
        this.suggestions.splice(0, this.suggestions.length);
        for (var i in data)
          this.suggestions.push(data[i]);
      })
  }

  suggestionListener(elem: any): void {
    this.suggestions.splice(0, this.suggestions.length)
    this.autoComplete.getCoord(elem.place_id)
      .subscribe(
      data => this.statusProvider.placeSelected.next(data),
      err => {
        this.statusProvider.placeSelected.error(err)
      })
  }
}
