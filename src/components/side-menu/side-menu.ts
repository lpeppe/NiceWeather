import { Component, Input } from '@angular/core';
import { StatusProvider } from '../../providers/status/status';
import { SelectedActivity } from './../../models/enums';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {

  @Input() content: any;

  constructor(public statusProvider: StatusProvider) { }

  seeSun() {
    this.statusProvider.selectedActivity.next(SelectedActivity.sun);
  }

  seeActivities() {
    this.statusProvider.selectedActivity.next(SelectedActivity.ski);
  }

}
