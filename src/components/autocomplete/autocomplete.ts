import { Component, Output, EventEmitter } from '@angular/core';
import { AutocompleteProvider } from './../../providers/autocomplete/autocomplete';
import { LatLng } from './../../app/interfaces';

@Component({
  selector: 'autocomplete',
  templateUrl: 'autocomplete.html',
})
export class AutocompleteComponent {

  @Output() placeSelected = new EventEmitter<LatLng>();
  suggestions: string[] = [];

  constructor(public autoComplete: AutocompleteProvider) {}

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
      .subscribe(data => {
        this.placeSelected.emit(data)
      }, err => console.log(err))
  }
}
