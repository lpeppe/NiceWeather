import { Component } from '@angular/core';

/**
 * Generated class for the ActivityListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'activity-list',
  templateUrl: 'activity-list.html'
})
export class ActivityListComponent {

  

  constructor() {}

  onPan(event: any) {
    console.log(event)
  }

}
