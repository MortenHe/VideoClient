import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'currentplayedplaylistinspector',
  templateUrl: './currentplayedplaylistinspector.component.html',
  styleUrls: ['./currentplayedplaylistinspector.component.scss']
})

export class CurrentplayedplaylistinspectorComponent implements OnInit {

  //aktuelle Zeit des laufenden Items
  time: string = "";

  //Liste der Dateien, die abgespielt werden
  files: any[];

  //aktueller Index in Titelliste
  position: number;

  //temp. Wert, wohin gerade gesprungen werden soll
  jumpPosition: number = -1;

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