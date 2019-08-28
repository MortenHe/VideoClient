import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment'
import { ResultfilterService } from '../../services/resultfilter.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {

  //Name der App fuer Ueberschrift (z.B. Video Player (dev))
  envName = environment.envName;

  //welche ModeFilter gibt es (all, conni, janosch, misc)
  showModeFilterList: boolean = false;

  //Shutdown Status
  shutdown$;

  //Services und Router injecten
  constructor(private bs: BackendService, private route: ActivatedRoute, private router: Router) {
  }

  //Beim Init
  ngOnInit() {

    //Komplettliste der Items in Service laden
    this.bs.loadFullItemlist();

    //immer wenn sich die Route /serach/kinder -> /search/jahresvideo aendert
    this.route.paramMap.subscribe(params => {

      //Modus (kinder vs. jahresvideo) aus URL-Parameter auslesen
      let mode = params.get('mode');

      //Modes, die es in der der Config gibt
      let domainModes = environment.domainModes.map(domainMode => { return domainMode.id });

      //Wenn es diesen Modus nicht gibt
      if (domainModes.indexOf(mode) === -1) {

        //zu 1. Modus aus Config navigieren
        this.router.navigate(['/search', environment.domainModes[0].id]);
      }

      //Modus per Service setzen
      this.bs.setMode(mode);
    });

    //Liste der Modefilter abonnieren
    this.bs.getModeFilterList().subscribe(modeFilterlist => {

      //Wenn Filter mit Inhalt kommt (z.B. Beginn liefert BS null)
      if (modeFilterlist) {

        //Filteritems holen
        let modeFilterListItems = modeFilterlist["filters"];

        //Filter-Buttons nur anzeigen, wenn es neben "Alle" und "Sonstige" noch andere Filter gibt
        this.showModeFilterList = modeFilterListItems.some(elem => {
          return (elem.id !== 'all' && elem.id !== 'misc');
        });
      }

      //es kam null von BS
      else {
        return false;
      }
    });

    //Shutdown Zustand abbonieren
    this.shutdown$ = this.bs.getShutdown();

    //Regelmassieg eine Nachricht an WSS schicken, damit ggf. die Verbindung wieder aufgebaut wird
    setInterval(() => {
      this.bs.sendMessage({
        type: "ping",
        value: ""
      });
    }, 1500);
  }
}