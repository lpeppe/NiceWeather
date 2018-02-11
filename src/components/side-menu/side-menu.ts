import { Component, Input } from '@angular/core';
import { SelectedActivity } from './../../models/enums';
import { StatusProvider } from '../../providers/status/status';
import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {

  @Input() content: any;

  constructor(public statusProvider: StatusProvider, public authProvider: AuthProvider) { }

  seeSun() {
    this.statusProvider.selectedActivity.next(SelectedActivity.sun);
  }

  seeActivities() {
    this.statusProvider.selectedActivity.next(SelectedActivity.ski);
  }

}
