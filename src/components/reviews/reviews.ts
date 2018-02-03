import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Review } from './../../models/interfaces';
import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';
import { SelectedActivity } from './../../models/enums';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

@Component({
  selector: 'reviews',
  templateUrl: 'reviews.html'
})

export class ReviewsComponent implements OnInit, OnDestroy {

  reviews: Review[];
  subscriptions: Subscription[];

  constructor(public dataProvider: DataProvider, public statusProvider: StatusProvider) {
    this.reviews = [];
    this.subscriptions = [];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.statusProvider.placeSelected
        .subscribe(async id => {
          if (id) {
            let maxDate = 1517604592;
            let minDate = 1483303282;
            let data = await this.dataProvider.getReviews();
            for (let id in data)
              data[id]['date'] = moment.unix(Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate).format('D MMM YYYY');
            this.reviews = data;
          }
        })
    )
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }
}
