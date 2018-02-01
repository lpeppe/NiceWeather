import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bikeDetails',
})
export class BikeDetailsPipe implements PipeTransform {
  transform(value: string, ...args): string {
    switch(value) {
      case "surface":
        return "Superficie";
      case "length":
        return "Lunghezza";  
      case "type":
        return "Tipologia";
      case "drop":
        return "Dislivello";  
    }
  }
}
