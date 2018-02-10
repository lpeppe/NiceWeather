import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'activity-button-panel',
  templateUrl: 'activity-button-panel.html'
})
export class ActivityButtonPanelComponent {

  @Input() navigator: boolean;
  @Input() call: boolean;

  constructor(public launchNavigator: LaunchNavigator, public callNumber: CallNumber) { }

  startNavigator() {
    // try {
    //   let destination = await this.dataProvider.getPlaceLatLng();
    //   await this.launchNavigator.navigate([destination.lat, destination.lng]);
    //   console.log('launched')
    // }
    // catch (err) {
    //   console.log(err);
    // }
  }

  startCall() {
    // let phoneNumber = (<SkiDetails>(await this.dataProvider
    //   .getActivityDetails(<any>SelectedActivity[SelectedActivity.ski],
    //     this.statusProvider.placeSelected.getValue()))).phone;
    // this.callNumber.callNumber(phoneNumber, true);
  }

}