import { Component, OnInit } from '@angular/core';
import { ResultfilterService } from '../../services/resultfilter.service';

@Component({
  selector: 'sortfilter',
  templateUrl: './sortfilter.component.html',
  styleUrls: ['./sortfilter.component.scss']
})

export class SortfilterComponent implements OnInit {

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

  //Sortierfeld und Reverse setzen
  setOrder(field, reverse) {
    this.fs.setReverseOrder(reverse);
    this.fs.setOrderField(field);
  }
}