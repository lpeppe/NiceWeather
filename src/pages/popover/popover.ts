import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { PickerColumn, PickerColumnOption, PickerOptions } from 'ionic-angular/components/picker/picker-options';

//@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  customOptions: PickerOptions = {
    // buttons: [
    //   {
    //     text: "Giorno",
    //     value: 0,
    //     disabled: true,
    //   },
    //   {
    //     text: "Ora",
    //     value: 1,
    //     disabled: true
    //   },
    //   {
    //     text: "Minuti",
    //     value: 2,
    //     disabled: true
    //   }
    // ],
    // columns: [
    //   {
    //     name: "Date",
    //     options: [{ text: "Oggi", value: "oggi" }, { text: "Domani", value: "domani" }, { text: "Dopodomani", value: "dopodomani" }],
    //     align: "center"
    //   },
    //   {
    //     name: "PartOfAday",
    //     options: [{ text: "Mattina", value: "mattina" }, { text: "Pomeriggio", value: "pomeriggio" }, { text: "Sera", value: "sera" }],
    //     align: "center"
    //   }
    // ]
    cssClass: "max-width: 0px;"
  };

  choice = "tempo";

  minDate = moment().add(1, 'hours').toISOString();;
  maxDate = moment().utc().add(2, 'days').format('YYYY-MM-DD');
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PopoverPage');
    // this.minDate = moment();


  }

}
