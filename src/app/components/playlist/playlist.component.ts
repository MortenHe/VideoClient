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

  //Darf Item sortiert werden? Nur Items hinter aktuell laufendem Titel
  //nur ab 2 Titeln in der Playlist
  //nur wenn nicht nur noch der letzte Titel uebrigt ist zur Sortierung (Playlist beim vorletzten Titel angekommen)
  draggable(index): boolean {
    return (index > this.position || this.position === -1) && this.files.length > 1 && (this.position + 2 < this.files.length);
  }

  //Wenn Sortiervorgang abgeschlossen ist, Server ueber neue Sortierung informieren
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.files, event.previousIndex + 1, event.currentIndex + 1);
    this.bs.sendMessage({
      type: "sort-playlist", value: {
        from: event.previousIndex,
        to: event.currentIndex
      }
    });
  };

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
}