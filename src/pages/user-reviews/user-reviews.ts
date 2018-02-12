import { ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { DataProvider } from './../../providers/data/data';
import { Component, OnDestroy } from '@angular/core';
import { SelectedActivity } from '../../models/enums';

@Component({
  selector: 'page-user-reviews',
  templateUrl: 'user-reviews.html',
})
export class UserReviewsPage implements OnDestroy {

  reviews: {
    activity: string,
    date: string,
    rating: number,
    review: string,
    placeName: string,
    id: string
  }[];
  subscriptions: Subscription[];


  constructor(public dataProvider: DataProvider, public viewCtrl: ViewController) {
    this.reviews = [];
    this.subscriptions = [];
    this.subscriptions.push(
      this.dataProvider.getUserReviews()
        .subscribe(async reviews => {
          this.reviews.splice(0, this.reviews.length);
          for (let id in reviews) {
            this.reviews.push({
              id,
              activity: reviews[id].activity,
              date: reviews[id].date,
              rating: reviews[id].rating,
              review: reviews[id].review,
              placeName: (await this.dataProvider.getActivityDetails((<any>reviews[id].activity), id)).name
            })
          }
        })
    )
  }

  getStarName(index: number, review: {
    id: string,
    activity: string,
    date: string,
    rating: number,
    review: string,
    placeName: string
  }): string {
    if (index <= review.rating)
      return "star";
    return "star-outline";
  }

  isBikeIcon(review: {
    id: string,
    activity: string,
    date: string,
    rating: number,
    review: string,
    placeName: string
  }): boolean {
    return review.activity == "bike";
  }

  getImageSrc(review: {
    id: string,
    activity: string,
    date: string,
    rating: number,
    review: string,
    placeName: string
  }): string {
    if(review.activity == "ski")
      return "assets/icon/ski_black.png";
    if(review.activity == "sea")
      return "assets/icon/beach_black.png";
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }
}
