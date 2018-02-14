import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Review } from './../../models/interfaces';
import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';
import { SelectedActivity } from './../../models/enums';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

import 'rxjs/add/operator/takeWhile';

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
        .subscribe(id => {
          if (id) {
            this.reviews.splice(0, this.reviews.length);
            let maxDate = 1517604592;
            let minDate = 1483303282;
            // let data = await this.dataProvider.getReviews();
            this.subscriptions.push(
              this.dataProvider.getReviews()
                .takeWhile(_ => this.statusProvider.placeSelected.getValue() == id)
                .subscribe(data => {
                  this.reviews.splice(0, this.reviews.length);
                  for (let id in data) {
                    if (!data[id]['date'])
                      data[id]['date'] = moment.unix(Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate).format('D MMM YYYY');
                    this.reviews.push(data[id]);
                  }
                })
            )
            // this.reviews = data;
          }
        })
    )
  }
  getStarName(index: number, review: number) {
    if (index <= review) {
      if (review > index && review < index + 1)
        return "star-half";
      return "star";
    } 
    
    return "star-outline";
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }
}
