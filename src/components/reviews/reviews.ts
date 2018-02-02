import { Component, Input, OnInit } from '@angular/core';
import { Review } from './../../models/interfaces';
import { DataProvider } from './../../providers/data/data';
import { SelectedActivity } from './../../models/enums';
import * as moment from 'moment';

@Component({
  selector: 'reviews',
  templateUrl: 'reviews.html'
})

export class ReviewsComponent implements OnInit {

  reviews: Review[];

  constructor(public dataProvider: DataProvider) {
    this.reviews = [];
  }

  async ngOnInit() {
    let maxDate = 1517604592;
    let minDate = 1483303282;
    let data = await this.dataProvider.getReviews();
    for (let id in data)
      data[id]['date'] = moment.unix(Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate).format('D MMM YYYY');
    this.reviews = data;
  }
}
