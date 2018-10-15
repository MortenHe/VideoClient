import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'random-playback',
  templateUrl: './random-playback.component.html',
  styleUrls: ['./random-playback.component.scss']
})

export class RandomPlaybackComponent implements OnInit {

  //Subject um bei destroy von subscribe abzumelden
  private ngUnsubscribe: Subject<any> = new Subject();

  //FormControl fuer Checkbox
  randomPlaybackCheckbox = new FormControl();

  //Services injecten
  constructor(private bs: BackendService) { }

  //Beim Init
  ngOnInit() {

    //Aenderungen an random-Wert verfolgen (z.B. wenn per Code Wert geandert wird oder wenn Komponente nach destroy neu erstellt wird)
    this.bs.getRandom().takeUntil(this.ngUnsubscribe).subscribe(bool => {

      //Checkbox-Wert (ohne Event) setzen
      this.randomPlaybackCheckbox.setValue(bool, { 'emitEvent': false })
    });

    //Aenderungen an Checkbox in Template verfolgen
    this.randomPlaybackCheckbox.valueChanges.subscribe(bool => {

      //Message an WSS schicken
      this.bs.sendMessage({ type: "toggle-random", value: "" });
    });
  }

  //Wenn Komponente zerstoert wird
  ngOnDestroy() {

    //von Subscirpiton abmelden
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}