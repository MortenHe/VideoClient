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

  //Zustand ob Verbindung zu WSS existiert
  connected: boolean;

  //Position in Playlist
  position: number = -1;

  //Shutdown Status
  shutdown$;

  //Anzahl der Sekunden bis Shutdown
  countdownTime: number;

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

    //Position in Playlist abbonieren
    this.bs.getPosition().subscribe(position => this.position = position);

    //Anzahl der Sekunden bis Shutdown abbonieren
    this.bs.getCountdownTime().subscribe(countdownTime => this.countdownTime = countdownTime);

    //Shutdown Zustand abbonieren
    this.shutdown$ = this.bs.getShutdown();

    //Zustand abbonieren, ob Verbindung zu WSS besteht
    this.bs.getConnected().subscribe(connected => this.connected = connected);

    //Regelmassieg eine Nachricht an WSS schicken, damit ggf. die Verbindung wieder aufgebaut wird
    setInterval(() => {
      this.bs.sendMessage({
        type: "ping",
        value: ""
      });
    }, 1500);
  }
}