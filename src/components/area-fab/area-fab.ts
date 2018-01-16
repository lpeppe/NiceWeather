import { Component } from '@angular/core';

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

  constructor() {
    console.log('Hello AreaFabComponent Component');
    this.text = 'Hello World';
  }

}
