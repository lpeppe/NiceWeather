import { Component, Input } from '@angular/core';
import { SelectedActivity } from './../../models/enums';
import { StatusProvider } from '../../providers/status/status';
import { AuthProvider } from './../../providers/auth/auth';
import { DataProvider } from './../../providers/data/data';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {

  @Input() content: any;

  constructor(public statusProvider: StatusProvider, public authProvider: AuthProvider, 
  public dataProvider: DataProvider) { }

  seeSun() {
    this.statusProvider.selectedActivity.next(SelectedActivity.sun);
  }

  async seeActivities() {
    try {
      this.statusProvider.selectedActivity.next(await this.dataProvider.getFavouriteActivity());
    }
    catch(err) {
      console.log(err)
    }
  }

}
