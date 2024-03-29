import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { domainModes } from '../../share/domainModes';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {

  //welche ModeFilter gibt es (all, conni, janosch, misc)
  showModeFilterList: boolean = false;

  //Shutdown Status
  shutdown$;

  //Liste der Files
  files: any[] = [];

  constructor(private bs: BackendService, private route: ActivatedRoute, private router: Router) {
  }

  //Beim Init
  ngOnInit() {

    //immer wenn sich die Route /serach/kinder -> /search/jahresvideo aendert
    this.route.paramMap.subscribe(params => {

      //Modus (kinder vs. jahresvideo) aus URL-Parameter auslesen
      let mode = params.get('mode');

      //Modes, die es in der der Config gibt
      let modes = domainModes.map(domainMode => { return domainMode.id });

      //Wenn es diesen Modus nicht gibt
      if (modes.indexOf(mode) === -1) {

        //zu 1. Modus aus Config navigieren
        this.router.navigate(['/search', domainModes[0].id]);
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

    //Files abonnieren
    this.bs.getFiles().subscribe(files => {
      this.files = files;
    })

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