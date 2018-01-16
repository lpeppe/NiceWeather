import { Component } from '@angular/core';
import * as moment from 'moment';

/**
 * Generated class for the TopPanelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'top-panel',
  templateUrl: 'top-panel.html'
})
export class TopPanelComponent {

  firstDate: string;
  secondDate: string;

  constructor() {
    this.firstDate = moment().format();
    this.secondDate = moment().add(1, 'days').format();
  }

}
