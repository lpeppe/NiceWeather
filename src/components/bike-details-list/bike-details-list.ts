import { Component } from '@angular/core';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';
import { AngularFireDatabase } from 'angularfire2/database';

import 'rxjs/add/operator/take';
import { Subscription } from 'rxjs/Subscription';

interface BikeDetails {
  drop: string,
  length: string,
  name: string,
  slope: string,
  surface: string,
  type: string
}

@Component({
  selector: 'bike-details-list',
  templateUrl: 'bike-details-list.html'
})


export class BikeDetailsListComponent {

  keyEnteredSub: Subscription;
  keyExitedSub: Subscription;
  details: { [key: string]: BikeDetails };
  keys: string[];

  constructor(public geoQueryProvider: GeoqueryProvider, public db: AngularFireDatabase) {
    this.details = {};
    this.keys = [];
    this.keyEnteredSub = this.geoQueryProvider.keyEntered.subscribe(data => {
      let id = Object.keys(data)[0];
      this.db.object(`newdb/bike/details/${id}`).valueChanges().take(1)
        .subscribe((details: BikeDetails) => {
          if (!this.details[id] && !this.keys.includes(id)) {
            this.details[id] = details;
            this.keys.push(id);
          }
        })
    })
    this.keyExitedSub = this.geoQueryProvider.keyExited.subscribe(data => {
      let id = Object.keys(data)[0];
      let idPos = this.keys.indexOf(id);
      if (this.details[id] && idPos != -1) {
        this.keys.splice(idPos, 1);
        this.details[id] = null;
      }
    })
  }

  ngOnDestroy() {
    this.keyEnteredSub.unsubscribe();
    this.keyExitedSub.unsubscribe();
  }

  getColor(slope: string): string {
    // console.log(slope)
    let slopeNum = Number(slope.substring(0, slope.length - 1));
    if(slopeNum < 5)
      return "green";
    if(slopeNum < 10)
      return "orange";
    return "red";    
  }
}
