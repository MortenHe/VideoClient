import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'currentplayedplaylistinspector',
  templateUrl: './currentplayedplaylistinspector.component.html',
  styleUrls: ['./currentplayedplaylistinspector.component.scss']
})

export class CurrentplayedplaylistinspectorComponent implements OnInit {

  //Liste der Dateien, die abgespielt werden
  files: any[] = [];

  //Gesamtlaenge der Playlist
  filesTotalTime: string = "";

  //aktueller Index in Titelliste
  position: number = 0;

  //aktuelle Zeit des laufenden Items
  time: string = "";

  //temp. Wert, wohin gerade gesprungen werden soll
  jumpPosition: number = -1;

  //Wurde Playlist schon gestartet?
  playlistStarted: boolean = false;

  //Service injecten
  constructor(private bs: BackendService) { }

  //beim Init
  ngOnInit() {

    //akutelle Zeit per Service abbonieren und in Variable schreiben
    this.bs.getTime().subscribe(time => this.time = time);

    //Liste des aktuellen per Service abbonieren und in Variable schreiben
    this.bs.getFiles().subscribe(files => this.files = files);

    //aktuellen Index in Titelliste abbonieren und in Variable schreiben (fuer CSS-Klasse)
    this.bs.getPosition().subscribe(position => {
      this.position = position;

      //temp. Sprungwert (fuer optische Darstellung) wieder zuruecksetzen
      this.jumpPosition = -1;
    });

    //Laenge der Playlist abbonieren
    this.bs.getFilesTotalTime().subscribe(filesTotalTime => this.filesTotalTime = filesTotalTime);

    //Abbonieren, ob Playlist gestartet wurde
    this.bs.getPlaylistStarted().subscribe(playlistStarted => this.playlistStarted = playlistStarted);
  }

  //zu gewissem Titel in Playlist springen
  jumpTo(position: number) {

    //Befehl an WSS schicken
    this.bs.sendMessage({ type: "jump-to", value: position });

    //Wenn zu einem anderen Titel gesprungen werden soll
    if (this.position !== position) {

      //bei diesem Eintrag einen Spinner anzeigen, bis der Titel geladen wurde
      this.jumpPosition = position;
    }
  }
}