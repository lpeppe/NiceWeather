import { Subscription } from 'rxjs/Subscription';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, Input, OnDestroy } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { DataProvider } from './../../providers/data/data';
import { StatusProvider } from './../../providers/status/status';
import { ModalController } from 'ionic-angular';
import { WriteReviewPage } from './../../pages/write-review/write-review';
import "rxjs/add/operator/skip"
@Component({
  selector: 'activity-button-panel',
  templateUrl: 'activity-button-panel.html'
})
export class ActivityButtonPanelComponent implements OnDestroy {

  @Input() navigator: boolean;
  @Input() call: boolean;
  @Input() review: boolean;

  favIcon: string = "heart-outline";
  isFavourite: boolean = false;
  subscriptions: Subscription[];

  constructor(public launchNavigator: LaunchNavigator, public callNumber: CallNumber,
    public dataProvider: DataProvider, public modalCrtl: ModalController,
    public authProvider: AuthProvider, public statusProvider: StatusProvider) {
    this.subscriptions = [];
    this.subscriptions.push(
      this.statusProvider.placeSelected
        .merge(this.authProvider.loggedIn)
        .debounceTime(10)
        .subscribe(_ => {
          let placeSelected = this.statusProvider.placeSelected.getValue();
          if (placeSelected) {
            this.dataProvider.isFavourite(placeSelected)
              .takeUntil(this.statusProvider.placeSelected.skip(1))
              .takeUntil(this.authProvider.loggedIn.skip(1))
              .subscribe(isFav => {
                isFav ? this.favIcon = "heart" : this.favIcon = "heart-outline"
                this.isFavourite = isFav;
              })
          }
        })
    )
  }

  startNavigator() {
    this.dataProvider.getNavigatorData()
      .then(destination => {
        return this.launchNavigator.navigate([destination.lat, destination.lng])
      })
      .then(_ => console.log("Navigator launched"))
      .catch(err => console.log(err))
  }

  async startCall() {
    try {
      this.callNumber.callNumber(await this.dataProvider.getPhoneNumber(), true);
    }
    catch (err) {
      console.log(err)
    }
  }

  writeReview() {
    this.modalCrtl.create(WriteReviewPage, null).present();
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }
}