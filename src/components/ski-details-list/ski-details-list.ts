import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { StatusProvider } from './../../providers/status/status';
import { GeoqueryProvider } from '../../providers/geoquery/geoquery';
import { AngularFireDatabase } from 'angularfire2/database';
interface SkiDetails {
  img: string,
  name: string,
  phone: string
}

@Component({
  selector: 'ski-details-list',
  templateUrl: 'ski-details-list.html'
})

export class SkiDetailsListComponent implements OnDestroy {

  subscriptions: Subscription[];
  details: { [key: string]: SkiDetails };
  keys: string[];
  selectedTrack: SkiDetails;

  constructor(public statusProvider: StatusProvider, public geoQueryProvider: GeoqueryProvider,
    public db: AngularFireDatabase) {
    this.details = {};
    this.keys = [];
    this.subscriptions = [];
    this.setObservables();
  }

  setObservables() {
    this.subscriptions.push(this.geoQueryProvider.keyEntered.subscribe(data => {
      let id = Object.keys(data)[0];
      this.db.object(`ski/details/${id}`).valueChanges().take(1)
        .subscribe((details: SkiDetails) => {
          if (!this.details[id] && !this.keys.includes(id)) {
            this.details[id] = details;
            this.keys.push(id);
          }
        })
    }))
    this.subscriptions.push(this.geoQueryProvider.keyExited.subscribe(data => {
      let id = Object.keys(data)[0];
      let idPos = this.keys.indexOf(id);
      if (this.details[id] && idPos != -1) {
        this.keys.splice(idPos, 1);
        this.details[id] = null;
      }
    }))
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

}
