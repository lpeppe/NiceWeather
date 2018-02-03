import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatusProvider } from './../../providers/status/status';
import { Subscription } from 'rxjs/Subscription';
import { SeaDetails } from './../../models/interfaces';
import { SelectedActivity } from './../../models/enums';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'sea-details',
  templateUrl: 'sea-details.html'
})
export class SeaDetailsComponent implements OnInit, OnDestroy {

  beachName: string;
  avgRating: number;
  subscriptions: Subscription[];

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider) {
    this.subscriptions = [];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.statusProvider.placeSelected
        .subscribe(async id => {
          if (id) {
            let details: SeaDetails = await this.dataProvider
              .getActivityDetails(<any>SelectedActivity[SelectedActivity.sea], id)
            this.beachName = details.name;
            this.avgRating = details.avgRating;
          }
        })
    )
  }

  ngOnDestroy() {
    for(let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

}
