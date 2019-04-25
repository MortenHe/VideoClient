import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { environment } from '../../environments/environment';

@Injectable()
export class JsondataService {

  //Service injecten
  constructor(private http: Http) { }

  //JSON-Daten aus files laden
  loadJson() {

    //Unterordner fuer JSON-Dateien aus Config laden
    const appId = environment.appId;

    //per HTTP JSON Hauptfile holen
    return this.http.get("assets/json/" + appId + "/videolist.json").map(data => {

      //JSON-Objekt laden. Dieses wird angepasst (gewisse Merkmale entfernt, items einfgefuegt)
      let jsonObj = data.json();

      //ForkJoin Array, damit auslesen der einzelnen Unter-JSONs (bibi-tina.json, bobo.json) parallel erfolgen kann
      let modeDataFileArr: Observable<any>[] = [];

      //Ueber Modes gehen (kinder, jahresvideo)
      for (let [mode, modeData] of Object.entries(jsonObj)) {

        //merken, welche Filter geloescht werden sollen
        let inactiveFilters = [];

        //Ueber Filter des Modus gehen (bibi-tina, bobo,...)
        modeData["filter"]["filters"].forEach((filterData, index) => {

          //filterID merken (bibi-tina, bobo)
          let filterID = filterData["id"];

          //All-Filter wird immer angezeigt
          if (filterID !== "all") {

            //Wenn Modus aktiv ist
            if (filterData["active"]) {

              //Feld "active" loeschen (wird nicht fuer die Oberflaeche benoetigt)
              delete jsonObj[mode]["filter"]["filters"][index]["active"];

              //Request erstellen, der JSON dieses Filters holt (z.B. bibi-tina.json)
              let request = this.http.get("assets/json/" + appId + "/" + mode + "/" + filterID + ".json").map(response => {

                //filterID (bibi-tina) und Modus (hsp) merken, da Info sonst spaeter ueberschrieben wurde
                let filterIDFile = (response.url).split(/[\\/]/).pop();
                let filterID = filterIDFile.replace('.json', '');

                //Ergebnis des Reqeusts als JSON + weitere Parameter weiterreichen
                return { data: response.json(), filterID: filterID, mode: mode };
              });

              //Request sammeln -> werden spaeter per forkjoin ausgefuehrt
              modeDataFileArr.push(request);
            }

            //Filter (und die zugehoerigen Dateien) sollen nicht sichtbar sein
            else {

              //Filter sammeln -> wird spaeter geloescht
              inactiveFilters.push(filterData);
            }
          }

          //"all" Filter
          else {

            //Feld "active" loeschen
            delete jsonObj[mode]["filter"]["filters"][index]["active"];
          }
        });

        //Ueber inaktive Filter gehen
        inactiveFilters.forEach(filter => {

          //Position in Array ermitteln
          let filterIndex = jsonObj[mode]["filter"]["filters"].indexOf(filter)

          //Filter aus Array loeschen
          jsonObj[mode]["filter"]["filters"].splice(filterIndex, 1);
        });
      }

      //ForkJoin fuer verschiedene Reqeusts ausfuehren
      return forkJoin(modeDataFileArr).map(results => {

        //Ueber die Treffer (JSON-files) gehen
        results.forEach((result, index) => {

          //Ueber Daten gehen
          result["data"].forEach(modeItem => {

            //Wenn Video aktiv ist
            if (modeItem["active"]) {

              //Feld "active" loeschen
              delete modeItem["active"];

              //Modus einfuegen (damit Filterung in Oberflaeche geht)
              modeItem["mode"] = result["filterID"];

              //Pfad zu Datei
              modeItem["file"] = result["mode"] + "/" + modeItem["mode"] + "/" + modeItem["file"];

              //Playlist- / Video-Objekt in Ausgabe Objekt einfuegen
              jsonObj[result["mode"]]["items"].push(modeItem);
            }
          });
        });

        //Daten-Objekt zurueckliefern
        return jsonObj;
      });
    });
  }
}