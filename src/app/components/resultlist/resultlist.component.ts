import { Component, OnInit } from '@angular/core';
import { Item } from '../../config/main-config';
import { BackendService } from '../../services/backend.service';
import { ResultfilterService } from '../../services/resultfilter.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ViewControlService } from '../../services/view-control.service';

@Component({
  selector: 'resultlist',
  templateUrl: './resultlist.component.html',
  styleUrls: ['./resultlist.component.scss']
})

export class ResultlistComponent {

  //audio vs. video
  appMode = environment.appMode;

  //Modus kindervideos vs. jahresvideo
  mode: string;

  //Itemliste als Observable. Wird in Template per async pipe ausgegeben
  items$: Observable<Item[]>;

  //Flag ob Tracks angezeigt werden sollen
  showTracks$: Observable<boolean>;

  //Ist Random erlaubt?
  allowRandom$: BehaviorSubject<boolean>;

  //welches Item in der Liste wurde angeklickt?
  activeItem: string = "";

  //Aktuelle Playlist (kommt von Server)
  files: any[] = [];

  //Services injecten
  constructor(private bs: BackendService, private fs: ResultfilterService, private vcs: ViewControlService) { }

  //beim Init
  ngOnInit() {

    //gefilterte und sortierte Itemliste per Service abbonieren
    this.items$ = this.bs.getFilteredItemlist();

    //flag ob Tracks angezeigt werden abbonieren
    this.showTracks$ = this.fs.getShowTracks();

    //Modus abbonieren
    this.bs.getMode().subscribe(mode => this.mode = mode);

    //AllowRandom abbonieren
    this.allowRandom$ = this.bs.getAllowRandom();

    //ActiveItem abbonieren
    this.bs.getActiveItem().subscribe(activeItem => {
      this.activeItem = activeItem;
    });

    //Laufende Playlist abbonieren
    this.bs.getFiles().subscribe(files => this.files = files);
  }

  //pruefen ob Item in Playlist ist
  isInPlaylist(item) {
    return this.files.indexOf(item) > -1;
  }

  //einzelnes Item abspielen
  addToPlaylist(item, startPlayback) {

    //Video-Playback starten oder neuen Titel enquen
    this.bs.sendMessage({
      type: "add-to-video-playlist", value: {
        "path": this.mode + "/" + item.mode + "/" + item.file,
        "name": item.name,
        "play": startPlayback
      }
    });
  }

}