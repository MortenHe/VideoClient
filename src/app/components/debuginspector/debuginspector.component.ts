import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ResultfilterService } from '../../services/resultfilter.service';
import { Item } from '../../config/main-config';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'debuginspector',
  templateUrl: './debuginspector.component.html',
  styleUrls: ['./debuginspector.component.scss']
})

export class DebuginspectorComponent implements OnInit {

  //Observables fuer Anzeige
  items$: Observable<Item[]>;
  mode$: Observable<string>;
  modeFilter$: Observable<string>;
  searchTerm$: Observable<string>;
  orderField$: Observable<string>;
  reverseOrder$: Observable<boolean>;
  showTracks$: Observable<boolean>;
  playlist$: Observable<any[]>;
  randomPlayback$: Observable<boolean>;
  allowRandom$: Observable<boolean>;

  //Env-Werte
  domainModes = environment.domainModes;
  envName = environment.envName;
  production = environment.production;
  proxyUrl = environment.proxyUrl;

  //Services injecten
  constructor(private bs: BackendService, private fs: ResultfilterService) { }

  //beim Init
  ngOnInit() {

    //Werte aus Services abbonieren und fuer Anzeige speichern
    this.items$ = this.bs.getFilteredItemlist();
    this.mode$ = this.bs.getMode();
    this.modeFilter$ = this.fs.getModeFilter();
    this.searchTerm$ = this.fs.getSearchTerm();
    this.orderField$ = this.fs.getOrderField();
    this.reverseOrder$ = this.fs.getReverseOrder();
    this.showTracks$ = this.fs.getShowTracks();
    this.randomPlayback$ = this.bs.getRandom();
    this.allowRandom$ = this.bs.getAllowRandom();
  }
}