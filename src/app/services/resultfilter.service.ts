import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class ResultfilterService {

  //Service injecten
  constructor() { }

  //modeFilter als BS, das abboniert werden kann
  modeFilterBS = new BehaviorSubject("all");

  //Suchfeld-Wert als BS, das abboniert werden kann
  searchTermBS = new BehaviorSubject("");

  //Sortierfeld als BS, das abboniert werden kann
  orderFieldBS = new BehaviorSubject("name");

  //umgekehrte Sortierung als BS, das abboniert werden kann
  reverseOrderBS = new BehaviorSubject(false);

  //Sollen Track angezeigt werden als BS, das abboniert werden kann
  showTracksBS = new BehaviorSubject(true);

  getModeFilter() {
    return this.modeFilterBS;
  }

  setModeFilter(mode: string) {

    //Neue Modusfilter setzten
    this.modeFilterBS.next(mode);

    //Dabei auch das Suchfeld leeren
    this.setSearchTerm("");
  }

  getSearchTerm() {
    return this.searchTermBS;
  }

  setSearchTerm(serachTerm: string) {
    this.searchTermBS.next(serachTerm);
  }

  getOrderField() {
    return this.orderFieldBS;
  }

  setOrderField(field: string) {
    this.orderFieldBS.next(field)
  }

  getReverseOrder() {
    return this.reverseOrderBS;
  }

  setReverseOrder(bool: boolean) {
    this.reverseOrderBS.next(bool);
  }

  getShowTracks() {
    return this.showTracksBS;
  }

  setShowTracks(bool) {
    this.showTracksBS.next(bool);
  }
}