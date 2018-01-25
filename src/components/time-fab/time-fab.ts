import { Component } from '@angular/core';

import { PopoverPage } from './../../pages/popover/popover';
import { PopoverController } from 'ionic-angular';

@Component({
  selector: 'time-fab',
  templateUrl: 'time-fab.html'
})
export class TimeFabComponent {


  constructor(public popoverCtrl: PopoverController) { }

  presentPopOver(event: any) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: event
    })
  }

}
