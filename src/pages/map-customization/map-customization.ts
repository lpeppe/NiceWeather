import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StatusProvider } from './../../providers/status/status';
import * as L from 'leaflet';
const maxZoom = 12;
const minZoom = 8;

@Component({
  selector: 'page-map-customization',
  templateUrl: 'map-customization.html',
})
export class MapCustomizationPage {

  values: boolean[];
  map: L.Map;
  constructor(public navCtrl: NavController, public navParams: NavParams, public statusProvider: StatusProvider) {
    this.values = [];
    for (let i = 0; i < 3; i++)
      this.values[i] = this.statusProvider.toggleValues.getValue()[i];

  }

  noStateLabel() {

    if (!this.values[0])
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjdkaw4va2n1g2rqvx0xlg5xb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');

    else if (!this.values[1])
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjdkb4z9n2imi2rk654zwiz2x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');

    else if (!this.values[2])
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjdk6rqey2hla2tpdlzgdwe90/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');
    else
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjd2tk5q93pgs2so6d37pik1x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');

    if (!this.values[0] && !this.values[1])
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjdkbyfu12jrp2sqp49kbe6ai/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');

    if (!this.values[1] && !this.values[2])
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjdkckp3xk0lf2skanpptt8wd/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');


    if (!this.values[0] && !this.values[2])
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjdkc82tu2nsd2rumm56rjvn0/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');


    if (!this.values[0] && !this.values[1] && !this.values[2])
      this.statusProvider.tileLayer.next('https://api.mapbox.com/styles/v1/marylen/cjdkc19c72k0u2sqj81swjzqh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeWxlbiIsImEiOiJjamQydGlkYjAzbWdoMndvNXU2ZDdodmVpIn0.gepdAbZLig1iW6Xi-5TRiA');

    this.statusProvider.toggleValues.next(this.values);
  }

}
