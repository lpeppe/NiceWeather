import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { DataProvider } from './../../providers/data/data';

@Component({
  selector: 'activity-button-panel',
  templateUrl: 'activity-button-panel.html'
})
export class ActivityButtonPanelComponent {

  @Input() navigator: boolean;
  @Input() call: boolean;

  constructor(public launchNavigator: LaunchNavigator, public callNumber: CallNumber,
    public dataProvider: DataProvider) { }

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
    catch(err) {
      console.log(err)
    }
  }

}