import { MapCustomizationPage } from './../../pages/map-customization/map-customization';
import { Component, Input } from '@angular/core';
import { SelectedActivity } from './../../models/enums';
import { StatusProvider } from '../../providers/status/status';
import { AuthProvider } from './../../providers/auth/auth';
import { DataProvider } from './../../providers/data/data';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
// import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {

  @Input() content: any;

  constructor(public statusProvider: StatusProvider, public authProvider: AuthProvider, 
  public dataProvider: DataProvider, public popoverCtrl: PopoverController) { }

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

  openMapCustomization() {
    // this.modalCtrl.create(MapCustomizationPage, null).present();
    let popover = this.popoverCtrl.create(MapCustomizationPage);
    popover.present({
      ev: event
    })
  }
}
