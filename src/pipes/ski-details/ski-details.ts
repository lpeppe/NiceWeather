import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skiDetails',
})
export class SkiDetailsPipe implements PipeTransform {
  transform(value: string, ...args): string {
    switch(value) {
      case "numPiste":
        return "Piste";
      case "pisteLength":
        return "Lunghezza Piste";
      case "height":
        return "Altitudine";
      case "blackPiste":
        return "Piste nere";
      case "bluePiste":
        return "Piste blu";
      case "redPiste":
        return "Piste rosse";
      case "greenPiste":
        return "Piste verdi";
    }
  }
}
