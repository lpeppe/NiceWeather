import { Component, Input, OnInit } from '@angular/core';
import { SkiDetails } from './../../models/interfaces';
import { StatusProvider } from './../../providers/status/status';

@Component({
  selector: 'ski-details',
  templateUrl: 'ski-details.html'
})
export class SkiDetailsComponent implements OnInit {

  @Input() selectedPiste: SkiDetails;
  pisteDetails: any[];

  constructor(public statusProvider: StatusProvider) {
    this.pisteDetails = [];
  }

  ngOnInit() {
    for (let key of Object.keys(this.selectedPiste))
      if (key != 'img' && key != 'name' && key != "phone")
        this.pisteDetails.push({
          name: key,
          value: this.selectedPiste[key]
        })
  }
}
