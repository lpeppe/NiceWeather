import { Component, OnDestroy } from '@angular/core';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';
import { StatusProvider } from './../../providers/status/status';
import { DataProvider } from '../../providers/data/data';
import { BikeDetails } from './../../models/interfaces';

import 'rxjs/add/operator/take';
import { Subscription } from 'rxjs/Subscription';
import { SelectedActivity } from '../../models/enums';

@Component({
  selector: 'bike-details-list',
  templateUrl: 'bike-details-list.html'
})

export class BikeDetailsListComponent implements OnDestroy {

  subscriptions: Subscription[];
  details: { [key: string]: BikeDetails };
  keys: string[];
  selectedPath: BikeDetails;

  constructor(public geoQueryProvider: GeoqueryProvider, public statusProvider: StatusProvider,
    public dataProvider: DataProvider) {
    this.details = {};
    this.keys = [];
    this.subscriptions = [];
    this.setObservables();
  }

  getColor(slope: string): string {
    // console.log(slope)
    let slopeNum = Number(slope.substring(0, slope.length - 1));
    if (slopeNum < 5)
      return "green";
    if (slopeNum < 10)
      return "orange";
    return "red";
  }

  setObservables() {

    this.subscriptions.push(
      this.statusProvider.selectedDays
        .subscribe(_ => {
          this.keys.splice(0, this.keys.length);
          this.details = {};
        })
    )

    this.subscriptions.push(
      this.statusProvider.favouritesMode
        .subscribe(_ => {
          this.keys.splice(0, this.keys.length);
          this.details = {};
        })
    )

    this.subscriptions.push(
      this.geoQueryProvider.keyEntered
        .subscribe(async data => {
          let id = Object.keys(data)[0];
          let details = await this.dataProvider.getActivityDetails(<any>SelectedActivity[SelectedActivity.bike], id);
          if (!this.details[id] && !this.keys.includes(id)) {
            this.details[id] = details;
            this.keys.push(id);
          }
        })
    )

    this.subscriptions.push(
      this.geoQueryProvider.keyExited
        .subscribe(data => {
          let id = Object.keys(data)[0];
          let idPos = this.keys.indexOf(id);
          if (this.details[id] && idPos != -1) {
            this.keys.splice(idPos, 1);
            this.details[id] = null;
          }
        })
    )

    // this.subscriptions.push(
    //   this.statusProvider.placeSelected
    //     .subscribe(id => {
    //       if (id)
    //         this.selectedPath = this.details[id];
    //       else
    //         this.selectedPath = undefined;
    //     })
    // )
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions)
      sub.unsubscribe();
  }
}
