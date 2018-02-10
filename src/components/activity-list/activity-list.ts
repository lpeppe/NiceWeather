import { Component, OnDestroy } from '@angular/core';
import { StatusProvider } from './../../providers/status/status';
import { GeoqueryProvider } from './../../providers/geoquery/geoquery';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'activity-list',
  templateUrl: 'activity-list.html'
})
export class ActivityListComponent implements OnDestroy {

  // @ViewChild('scrollItem') scrollItem: ElementRef;
  height: string;
  subscriptions: Subscription[];
  // firstTimeOpened = true;

  constructor(public statusProvider: StatusProvider, public geoQueryProvider: GeoqueryProvider) {
    this.subscriptions = [];
    this.height = '0px';
    this.subscriptions.push(
      this.statusProvider.placeSelected.subscribe(id => {
        if (id)
          this.height = "30vh";
      })
    )
  }

  onPan(event: any) {
    this.height = 'calc(100vh - ' + event.center.y + 'px';
  }

  onClick(event: any) {
    this.height = '30vh';
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

}
