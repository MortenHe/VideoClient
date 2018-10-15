import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ViewControlService {

  //Welche View ist gerade aktiv
  view$: BehaviorSubject<string> = new BehaviorSubject<string>("search");

  constructor() { }

  //View setzen
  setView(view) {
    this.view$.next(view);
  }

  //View liefern
  getView() {
    return this.view$;
  }

}
