import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  //String formattieren
  transform(value: string, modeFilter?: string): any {

    //Zahlen filtern und trimmen: 2014-08 - August 2014 -> August 2014, 2014-08-23 - Laila -> Laila
    let shortName = value.replace(/([0-9]{4}-[0-9]{2}(-[0-3][0-9])* - | ^[0-9][0-9] )/g, '').trim();

    //Wenn ein anderer Modefilter als Alle oder Sonstige ausgewaehlt ist, den Namen der Serie (Bibi und Tina - ) vorne wegkuerzen fuer mehr Platz
    if (modeFilter && modeFilter !== 'all' && modeFilter !== 'misc') {
      shortName = shortName.replace(/^[A-Za-z0-9_äÄöÖüÜß ]* - /, '');
    }
    return shortName;
  }
}