import { Component } from '@angular/core';
import { StatusProvider } from './../../providers/status/status';

/**
 * Generated class for the AreaFabComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'area-fab',
  templateUrl: 'area-fab.html'
})
export class AreaFabComponent {

  text: string;

  constructor(public statusProvider: StatusProvider) {
    console.log('Hello AreaFabComponent Component');
    this.text = 'Hello World';
  }

  onMenuOpened(event: any) {
    this.statusProvider.areaFabOpened.next(!this.statusProvider.areaFabOpened.getValue());
  }

}
