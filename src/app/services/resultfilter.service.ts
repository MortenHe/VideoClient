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

  //aktuell ausgewaehlten Mode-Filter liefern
  getModeFilter() {
    return this.modeFilterBS;
  }

  //Filter setzen
  setModeFilter(mode: string) {
    this.modeFilterBS.next(mode);
  }

  //aktuellen Suchbegriff liefern
  getSearchTerm() {
    return this.searchTermBS;
  }

  //Suchterm setzen
  setSearchTerm(serachTerm: string) {
    this.searchTermBS.next(serachTerm);
  }

  //Sortierfeld liefern
  getOrderField() {
    return this.orderFieldBS;
  }

  //Sortierfeld setzen
  setOrderField(field: string) {
    this.orderFieldBS.next(field)
  }

  //umgekehrte Sortierung liefern
  getReverseOrder() {
    return this.reverseOrderBS;
  }

  //Umgekehrte Sortierung setzen
  setReverseOrder(bool: boolean) {
    this.reverseOrderBS.next(bool);
  }

  //Track-Sichtbarkeit liefern
  getShowTracks() {
    return this.showTracksBS;
  }

  //Track-Sichtbarkeit setzen
  setShowTracks(bool) {
    this.showTracksBS.next(bool);
  }
}