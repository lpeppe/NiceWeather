import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SkiDetails } from './../../models/interfaces';
import { StatusProvider } from './../../providers/status/status';
import { DataProvider } from '../../providers/data/data';
import { Subscription } from 'rxjs/Subscription';
import { SelectedActivity } from './../../models/enums';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'ski-details',
  templateUrl: 'ski-details.html'
})
export class SkiDetailsComponent implements OnInit, OnDestroy {

  pisteDetails: any[];
  subscriptions: Subscription[];
  pisteName: string;
  numPiste: number;

  constructor(public statusProvider: StatusProvider, public dataProvider: DataProvider,
    public launchNavigator: LaunchNavigator, public callNumber: CallNumber) {
    this.pisteDetails = [];
    this.subscriptions = [];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.statusProvider.placeSelected
        .subscribe(async id => {
          if (id) {
            this.pisteDetails.splice(0, this.pisteDetails.length);
            let details: SkiDetails = await this.dataProvider
              .getActivityDetails(<any>SelectedActivity[SelectedActivity.ski], id)
            this.pisteName = details.name;
            this.numPiste = details.numPiste;
            this.addPisteDetails(details);
          }
        })
    )
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

  addPisteDetails(details: SkiDetails) {
    this.pisteDetails.push({
      name: 'blackPiste',
      value: details.blackPiste,
      color: 'black'
    });
    this.pisteDetails.push({
      name: 'bluePiste',
      value: details.bluePiste,
      color: 'primary'
    });
    this.pisteDetails.push({
      name: 'redPiste',
      value: details.redPiste,
      color: 'red'
    });
    this.pisteDetails.push({
      name: 'greenPiste',
      value: details.greenPiste,
      color: 'green'
    });
  }

  async startNavigator() {
    try {
      let destination = await this.dataProvider.getPlaceLatLng();
      await this.launchNavigator.navigate([destination.lat, destination.lng]);
      console.log('launched')
    }
    catch (err) {
      console.log(err);
    }
  }

  async startCall() {
    let phoneNumber = (<SkiDetails>(await this.dataProvider
      .getActivityDetails(<any>SelectedActivity[SelectedActivity.ski],
        this.statusProvider.placeSelected.getValue()))).phone;
    this.callNumber.callNumber(phoneNumber, true);
  }
}
