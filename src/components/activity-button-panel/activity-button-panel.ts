import { AuthProvider } from './../../providers/auth/auth';
import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { DataProvider } from './../../providers/data/data';
import { ModalController } from 'ionic-angular';
import { WriteReviewPage } from './../../pages/write-review/write-review';

@Component({
  selector: 'activity-button-panel',
  templateUrl: 'activity-button-panel.html'
})
export class ActivityButtonPanelComponent {

  @Input() navigator: boolean;
  @Input() call: boolean;
  @Input() review: boolean;

  constructor(public launchNavigator: LaunchNavigator, public callNumber: CallNumber,
    public dataProvider: DataProvider, public modalCrtl: ModalController,
    public authProvider: AuthProvider) { }

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

}