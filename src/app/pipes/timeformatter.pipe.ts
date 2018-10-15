import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeformatter'
})

//Zeit-String formattieren
export class TimeformatterPipe implements PipeTransform {

  transform(length_string: string, args?: any): any {
    
     //Wenn keine Stunde und keine 10-er Minute
     if (length_string.startsWith("00:0")) {

      //gekuerzten String zureuckgeben
      return length_string.substring(4);
    }

    //Wenn keine Stunde
    else if (length_string.startsWith("00:")) {

      //gekuerzten String zureuckgeben
      return length_string.substring(3);
    }

    //wenn keine 10er Stunde
    else if (length_string.startsWith("0")) {

      //gekuerzten String zureuckgeben
      return length_string.substring(1);
    }

    //keine Bedingung erfuellt
    else {

      //Original-String zurueckgeben
      return length_string;
    }
  }
}