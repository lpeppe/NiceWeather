import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from '../../providers/status/status';
import { SelectedActivity } from '../../models/enums';

@Component({
  selector: 'page-write-review',
  templateUrl: 'write-review.html',
})
export class WriteReviewPage {

  rate = 0;
  placeName: string;
  text: string = "";
  rateError = false;

  constructor(public viewCtrl: ViewController, public dataProvider: DataProvider, 
    public statusProvider: StatusProvider) {
    let activity = this.statusProvider.selectedActivity.getValue();
    let id = this.statusProvider.placeSelected.getValue();
    this.dataProvider.getActivityDetails((<any>SelectedActivity[activity]), id)
      .then(data => this.placeName = data.name)
      .catch(err => console.log(err))
  }

  getStarType(starIndex: number): string {
    if (this.rate == 0 || starIndex > this.rate)
      return 'star-outline';
    if (starIndex <= this.rate)
      return 'star';
  }

  async sendReview() {
    if(this.rate == 0)
      this.rateError = true;
    else {
      this.rateError = false;
      await this.dataProvider.addReview(this.rate, this.text);
      this.viewCtrl.dismiss();
    }
  }

}
