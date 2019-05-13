import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  //String formattieren
  transform(value: string, args?: any): any {

    //Zahlen filtern und trimmen: 2014-08 - August 2014 -> August 2014
    return value.replace(/([0-9]{4}-[0-9]{2} - | ^[0-9][0-9] )/g, '').trim();
  }
}