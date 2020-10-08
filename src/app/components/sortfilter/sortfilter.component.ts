import { Component, OnInit } from '@angular/core';
import { ResultfilterService } from '../../services/resultfilter.service';

@Component({
  selector: 'sortfilter',
  templateUrl: './sortfilter.component.html',
  styleUrls: ['./sortfilter.component.scss']
})

export class SortfilterComponent implements OnInit {

  sortOptions = [{
    orderField: "name",
    reverseOrder: false
  }, {
    orderField: "added",
    reverseOrder: true
  }, {
    orderField: "length",
    reverseOrder: true
  }, {
    orderField: "length",
    reverseOrder: false
  }];

  //Welche Sortieroption ist aktiv?
  sortOptionsIndex = 0;

  //Sortierfeld
  orderField: string;

  //umgekehrte Sortierung
  reverseOrder: boolean;

  //Service injecten
  constructor(private fs: ResultfilterService) { }

  //beim Init
  ngOnInit() {

    //Sortierfeld per Service abbonieren
    this.fs.getOrderField().subscribe(orderField => this.orderField = orderField);

    //umgekehrte Sortierung per Service abbonieren
    this.fs.getReverseOrder().subscribe(reverseOrder => this.reverseOrder = reverseOrder);
  }

  //Zur nachesten Sortieroption wechseln
  setNextOrder() {

    //Naechste Sortieroption auswaehlen
    this.sortOptionsIndex = (this.sortOptionsIndex + 1) % this.sortOptions.length;
    const newOption = this.sortOptions[this.sortOptionsIndex];

    //Sortieroption setzen
    this.fs.setReverseOrder(newOption.reverseOrder);
    this.fs.setOrderField(newOption.orderField);
  }
}