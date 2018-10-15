import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../config/main-config';

@Pipe({
  name: 'modeFilter'
})

//nach einem Modus im Item-Objekt filtern
export class ModeFilterPipe implements PipeTransform {

  //items und modus als Parameter
  transform(items: Item[], mode: string): any {

    //Wenn alle Items angezeigt werden sollen
    if (mode === "all") {

      //Alle Items zurueckgeben
      return items;
    }

    //es ist auf einen gewissen Modus (z.B. Conni) eingeschraenkt
    else {

      //Nur die Elemente eines gewissen Modus zurueckgeben
      return items.filter(item =>
        item.mode === mode
      );
    }
  }
}