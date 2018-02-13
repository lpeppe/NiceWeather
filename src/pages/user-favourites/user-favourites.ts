import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from './../../providers/data/data';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-user-favourites',
  templateUrl: 'user-favourites.html',
})
export class UserFavouritesPage implements OnDestroy {

  favourites: {
    name: string,
    activity: string,
    id: string
  }[];
  subsctiptions: Subscription[]

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataProvider: DataProvider, public viewCtrl: ViewController) {
    this.subsctiptions = [];
    this.favourites = [];
    this.subsctiptions.push(
      this.dataProvider.getFavourites()
        .subscribe(data => {
          this.favourites.splice(0, this.favourites.length)
          for (let id in data)
            this.favourites.push({
              name: data[id].name,
              activity: data[id].activity,
              id
            })
        })
    )
  }

  getImageSrc(favourite: {
    name: string,
    activity: string,
    id: string
  }): string {
    if (favourite.activity == "ski")
      return "assets/icon/ski_black.png";
    if (favourite.activity == "sea")
      return "assets/icon/beach_black.png";
  }

  ngOnDestroy() {
    for (let subscription of this.subsctiptions)
      subscription.unsubscribe();
  }

}
