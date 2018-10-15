import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'resultlistinspector',
  templateUrl: './resultlistinspector.component.html',
  styleUrls: ['./resultlistinspector.component.scss']
})

export class ResultlistinspectorComponent implements OnInit {

  //Trefferliste als Observable
  items$: Observable<any>;

  //Service injecten
  constructor(private bs: BackendService) { }

  //Beim Init
  ngOnInit() {

    //Aenderungen bei Videoliste verfolgen, damit Anzahl der Treffer angepasst werden kann
    this.items$ = this.bs.getFilteredItemlist();
  }
}