import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BikeDetails } from './../../models/interfaces';
import { StatusProvider } from './../../providers/status/status';
import { DataProvider } from '../../providers/data/data';
import { SelectedActivity } from '../../models/enums';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'bike-details',
  templateUrl: 'bike-details.html'
})
export class BikeDetailsComponent implements OnInit, OnDestroy {

  pathDetails: any[];
  pathName: string;
  subscriptions: Subscription[];

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider) {
    this.pathDetails = [];
    this.subscriptions = [];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.statusProvider.placeSelected
        .subscribe(async selectedPlace => {
          if (selectedPlace) {
            this.pathDetails.splice(0, this.pathDetails.length);
            let details: BikeDetails = await this.dataProvider
              .getActivityDetails(<any>SelectedActivity[SelectedActivity.bike], selectedPlace)
            this.pathName = details.name;
            for (let key of Object.keys(details))
              if (key != 'slope' && key != 'name' && key != 'avgRating')
                this.pathDetails.push({
                  name: key,
                  value: details[key]
                })
          }
        })
    )
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }
}
