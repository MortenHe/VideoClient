import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})

export class PlaylistComponent implements OnInit {

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

      //kurz Verzoegerung damit Spinner sichtbar ist
      setTimeout(() => {
        this.position = position;

        //temp. Sprungwert (fuer optische Darstellung) wieder zuruecksetzen
        this.jumpPosition = -1;
      }, 1000);
    });

    //Laenge der Playlist abbonieren
    this.bs.getFilesTotalTime().subscribe(filesTotalTime => this.filesTotalTime = filesTotalTime);
  }

  //Titel aus Playlist entfernen
  removeItemFromPlaylist(position: number) {
    this.bs.sendMessage({ type: "remove-from-playlist", value: position });
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

  //Wenn Sortiervorgang abgeschlossen ist, Server ueber neue Sortierung informieren
  drop(event: CdkDragDrop<string[]>) {

    //lokale Daten sortieren
    moveItemInArray(this.files, event.previousIndex, event.currentIndex);

    //ggf. position (=aktives Video) anpassen, wenn gerade ein Video laeuft
    if (this.position > -1) {

      //aktives Video wurde verschoben -> Endposition als neues aktives Video
      if (event.previousIndex === this.position) {
        this.position = event.currentIndex;
      }

      //Video vor akt. Video wurde auf Position des akt. Videos oder dahinter geschoben -> akt. Video rueckt eins nach oben
      else if (event.previousIndex < this.position && event.currentIndex >= this.position) {
        this.position--;
      }

      //Video hinter akt. Video wurde auf Position des akt. Videos oder davor geschoben -> akt. Video rueckt eins nach unten
      else if (event.previousIndex > this.position && event.currentIndex <= this.position) {
        this.position++;
      }
    }

    //Server informieren
    this.bs.sendMessage({
      type: "sort-playlist", value: {
        from: event.previousIndex,
        to: event.currentIndex
      }
    });
  };
}