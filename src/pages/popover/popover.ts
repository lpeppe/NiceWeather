import { Component } from '@angular/core';
import * as moment from 'moment';
import { StatusProvider } from './../../providers/status/status';
import { ViewController } from 'ionic-angular';

//@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  // minDate = moment().toISOString();
  // maxDate = moment().add(4, 'days').toISOString();
  options = {
    millisecond: 0,
    second: 0,
    minute: 0,
    hour: 13
  };
  days = [
    moment().set(this.options),
    moment().set(this.options).add(1, 'days'),
    moment().set(this.options).add(2, 'days'),
    moment().set(this.options).add(3, 'days'),
    moment().set(this.options).add(4, 'days')
  ]
  constructor(public statusProvider: StatusProvider, public viewController: ViewController) { }

  onSelect(index: number) {
    this.statusProvider.selectedDay.next(this.days[index].unix())
    this.viewController.dismiss();
  }

  isChecked(index: number) {
    return this.statusProvider.selectedDay.getValue() == this.days[index].unix()
  }

}
