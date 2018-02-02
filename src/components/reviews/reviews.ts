import { Component, Input, OnInit } from '@angular/core';
import { Review } from './../../models/interfaces';
import { DataProvider } from './../../providers/data/data';
import { SelectedActivity } from './../../models/enums';

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
    this.reviews = await this.dataProvider.getReviews();
    console.log(this.reviews)
  }
}
