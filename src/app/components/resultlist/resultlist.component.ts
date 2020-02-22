import { Component, OnInit } from '@angular/core';
import { Item } from '../../config/main-config';
import { BackendService } from '../../services/backend.service';
import { ResultfilterService } from '../../services/resultfilter.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'resultlist',
  templateUrl: './resultlist.component.html',
  styleUrls: ['./resultlist.component.scss']
})

export class ResultlistComponent {

  //Modus kindervideos vs. jahresvideo
  mode: string;

  //Itemliste als Observable. Wird in Template per async pipe ausgegeben
  items$: Observable<Item[]>;

  //Flag ob Tracks angezeigt werden sollen
  showTracks$: Observable<boolean>;

  //Aktuelle Playlist (kommt von Server)
  files: any[] = [];

  //Modefilter
  modeFilter: string;

  //Suchterm fuer Markierung der Trefferliste
  searchTerm: string;

  //Services injecten
  constructor(private bs: BackendService, private fs: ResultfilterService) { }

  //beim Init
  ngOnInit() {

    //gefilterte und sortierte Itemliste per Service abbonieren
    this.items$ = this.bs.getFilteredItemlist();

    //flag ob Tracks angezeigt werden abbonieren
    this.showTracks$ = this.fs.getShowTracks();

    //Modus abbonieren
    this.bs.getMode().subscribe(mode => this.mode = mode);

    //Laufende Playlist abbonieren
    this.bs.getFiles().subscribe(files => this.files = files);

    //ModeFilter (bibi, bibi-tina, all,...) abbonieren
    this.fs.getModeFilter().subscribe(modeFilter => this.modeFilter = modeFilter);

    //Suchterm abbonieren
    this.fs.getSearchTerm().subscribe(searchTerm => this.searchTerm = searchTerm);
  }

  //pruefen ob Item in Playlist ist
  isInPlaylist(item) {
    return (this.files.some(e => this.mode + "/" + item.mode + "/" + e.file === item.file));
  }

  //einzelnes Item abspielen
  addToPlaylist(item, startPlayback) {

    //doppeltes Einfuege verhindern
    if (this.isInPlaylist(item)) {
      console.log("item already in playlist");
      return;
    }

    //Video-Playback starten oder neuen Titel enquen
    this.bs.sendMessage({
      type: "add-to-video-playlist", value: {
        "file": this.mode + "/" + item.mode + "/" + item.file,
        "name": item.name,
        "length": item.length,
        "startPlayback": startPlayback
      }
    });

    //Beim Starten oder Einreihen eines Vidoes das Suchfeld leeren
    this.fs.setSearchTerm("");
  }
}