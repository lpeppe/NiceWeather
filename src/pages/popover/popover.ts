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
  selectedDays: number[];
  constructor(public statusProvider: StatusProvider, public viewController: ViewController) {
    this.selectedDays = this.statusProvider.selectedDays.getValue();
  }

  onChange(index: number) {
    let i = this.selectedDays.indexOf(this.days[index].unix());
    if (i != -1 && this.selectedDays.length > 1)
      this.selectedDays.splice(i, 1);
    else if (i == -1)
      this.selectedDays.push(this.days[index].unix());
    this.statusProvider.selectedDays.next(this.selectedDays.sort());
    this.statusProvider.placeSelected.next(undefined);
  }

  isChecked(index: number) {
    return this.statusProvider.selectedDays.getValue().includes(this.days[index].unix());
  }

  getDisplayName(day: moment.Moment): string {
    if (day.dayOfYear() == moment().set(this.options).dayOfYear())
      return 'oggi';
    if (day.dayOfYear() == moment().set(this.options).add(1, 'days').dayOfYear())
      return 'domani';
    return day.format('dddd DD');
  }

  getDayColor(day: moment.Moment): string {
    if (day.day() == 0)
      return "red";
    if (day.day() == 6)
      return "orange";
  }

  isDisabled(index: number): boolean {
    return this.selectedDays.length == 1 && this.selectedDays[0] == this.days[index].unix()
  }
}
