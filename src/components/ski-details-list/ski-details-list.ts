import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { StatusProvider } from './../../providers/status/status';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';
import { SkiDetails } from './../../models/interfaces';
import { DataProvider } from '../../providers/data/data';
import { SelectedActivity } from './../../models/enums';

@Component({
  selector: 'ski-details-list',
  templateUrl: 'ski-details-list.html'
})

export class SkiDetailsListComponent implements OnDestroy {

  subscriptions: Subscription[];
  details: { [key: string]: SkiDetails };
  keys: string[];
  selectedPiste: SkiDetails;

  constructor(public statusProvider: StatusProvider, public geoQueryProvider: GeoqueryProvider,
    public dataProvider: DataProvider) {
    this.details = {};
    this.keys = [];
    this.subscriptions = [];
    this.setObservables();
  }

  setObservables() {
    this.subscriptions.push(
      this.geoQueryProvider.keyEntered
        .subscribe(async data => {
          let id = Object.keys(data)[0];
          let details: SkiDetails = await this.dataProvider.getActivityDetails(<any>SelectedActivity[SelectedActivity.ski], id);
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
    this.subscriptions.push(
      this.statusProvider.placeSelected
        .subscribe(id => {
          if (id)
            this.selectedPiste = this.details[id];
          else
            this.selectedPiste = undefined;
        })
    )
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

}
