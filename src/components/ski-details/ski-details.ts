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
    // this.pisteDetails.push({
    //   name: 'height',
    //   value: this.selectedPiste.height
    // });
    // this.pisteDetails.push({
    //   name: 'numPiste',
    //   value: this.selectedPiste.numPiste
    // });
    // this.pisteDetails.push({
    //   name: 'pisteLength',
    //   value: this.selectedPiste.pisteLength
    // });
    this.pisteDetails.push({
      name: 'blackPiste',
      value: this.selectedPiste.blackPiste,
      color: 'black'
    });
    this.pisteDetails.push({
      name: 'bluePiste',
      value: this.selectedPiste.bluePiste,
      color: 'primary'
    });
    this.pisteDetails.push({
      name: 'redPiste',
      value: this.selectedPiste.redPiste,
      color: 'red'
    });
    this.pisteDetails.push({
      name: 'greenPiste',
      value: this.selectedPiste.greenPiste,
      color: 'green'
    });
  }
}
