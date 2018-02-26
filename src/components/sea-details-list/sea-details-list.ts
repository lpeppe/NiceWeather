import { Component, OnDestroy } from '@angular/core';
import { SeaDetails } from './../../models/interfaces';
import { SelectedActivity } from './../../models/enums';
import { Subscription } from 'rxjs/Subscription';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';
import { DataProvider } from '../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';

@Component({
  selector: 'sea-details-list',
  templateUrl: 'sea-details-list.html'
})
export class SeaDetailsListComponent implements OnDestroy {

  subscriptions: Subscription[];
  details: { [key: string]: SeaDetails };
  keys: string[];

  constructor(public geoQueryProvider: GeoqueryProvider, public dataProvider: DataProvider,
    public statusProvider: StatusProvider) {
    this.details = {};
    this.keys = [];
    this.subscriptions = [];
    this.setObservables();
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
          let details: SeaDetails = await this.dataProvider.getActivityDetails(<any>SelectedActivity[SelectedActivity.sea], id);
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
  }
  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

  getStarName(index: number, rate: number) {
    if (index <= rate) {
      if (rate > index && rate < index + 1)
        return "star-half";
      return "star";
    } 
    
    return "star-outline";
  }
}
