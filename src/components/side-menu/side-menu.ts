import { Component, Input } from '@angular/core';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {

  @Input() content: any;

  constructor() { }

}
