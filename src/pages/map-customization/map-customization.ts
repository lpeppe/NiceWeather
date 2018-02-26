import { Component } from '@angular/core';
import { StatusProvider } from './../../providers/status/status';
import * as L from 'leaflet';

@Component({
  selector: 'page-map-customization',
  templateUrl: 'map-customization.html',
})
export class MapCustomizationPage {

  values: boolean[];
  map: L.Map;
  constructor(public statusProvider: StatusProvider) {
    this.values = [];
    for (let i = 0; i < 3; i++)
      this.values[i] = this.statusProvider.toggleValues.getValue()[i];
  }

  onToggle() {
    this.statusProvider.toggleValues.next(this.values);
  }

}
