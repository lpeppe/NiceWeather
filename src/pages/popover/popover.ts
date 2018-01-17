import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// @IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  choice = "tempo"
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

}
