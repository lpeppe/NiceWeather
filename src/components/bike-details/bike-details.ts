import { Component, Input, OnInit } from '@angular/core';
import { BikeDetails } from './../../models/interfaces';
import { StatusProvider } from './../../providers/status/status';

@Component({
  selector: 'bike-details',
  templateUrl: 'bike-details.html'
})
export class BikeDetailsComponent implements OnInit {

  @Input() selectedPath: BikeDetails;

  pathDetails: any[];

  constructor(public statusProvider: StatusProvider) {
    this.pathDetails = [];
  }

  ngOnInit() {
    for (let key of Object.keys(this.selectedPath))
      if (key != 'slope' && key != 'name')
        this.pathDetails.push({
          name: key,
          value: this.selectedPath[key]
        })
  }
}
