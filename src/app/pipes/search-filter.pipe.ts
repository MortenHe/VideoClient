import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../config/main-config';

@Pipe({
  name: 'searchFilter'
})

//Itemliste anhand eines Suchstrings filtern
export class SearchFilterPipe implements PipeTransform {

  //Suchstring wird uebergeben
  transform(items: Item[], searchString: string, includeTracks: boolean): any {

    //Wenn Suchfeld leer ist
    if (!searchString) {

      //Treffer anzeigen
      return items;
    }

    //Filtersuchbegriff ausgewaehlt
    else {

      //Items filtern
      return items.filter(item => {

        //Titel (video) des Items soll durchsucht werden
        let haystack = item.name;

        //Wenn auch Tracks durchsucht werden sollen
        if (includeTracks && item.tracks) {

          //An Titel noch alle Tracks anhaengen: Janosch - Schnuddelgeschichten Wolkenzimmerhaus Oh wie einsam ist die Luft...
          haystack += " " + item.tracks.join(" ");
        }

        //durchsuchten String und Suchstring als lowercase: "Bobo Drache" -> "bobo drache"
        const haystackLower = haystack.toLowerCase();
        const searchStringLower = searchString.toLowerCase();

        //Suchstring in einzelne Terme aufteilen: "bobo drache" -> ["bobo", "drache"]
        const searchStringArray = searchStringLower.split(" ");

        //davon ausgehen, dass Suche gefunden wird
        let containsSubstrings = true;

        //Alle Terme des Suchstrings pruefen, ob sie im durchsuchten String enthalten sind
        for (const searchStringValue of searchStringArray) {

          //Nur nicht-leere Terme ansehen
          if (searchStringValue.trim() != "") {

            //wenn Term nicht in Suchstring enthalten ist
            if (haystackLower.indexOf(searchStringValue) === -1) {

              //dieses Item fuer Anzeige ignorieren und keine weiteren Terme mehr pruefen
              containsSubstrings = false;
              break;
            }
          }
        }

        //Ergebnis zurueckliefern, ob Item angezeigt werden soll
        return containsSubstrings;
      });
    }
  }
}