import { Component } from '@angular/core';

import { StatusProvider } from './../../providers/status/status';

@Component({
  selector: 'day-selector',
  templateUrl: 'day-selector.html'
})
export class DaySelectorComponent {

  constructor(public statusProvider: StatusProvider) {}

}
