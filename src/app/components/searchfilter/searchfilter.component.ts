import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { ResultfilterService } from '../../services/resultfilter.service';

@Component({
  selector: 'searchfilter',
  templateUrl: './searchfilter.component.html',
  styleUrls: ['./searchfilter.component.scss']
})

export class SearchfilterComponent implements OnInit {

  //Suchfeld
  searchField = new FormControl("");

  //Services injecten
  constructor(private fs: ResultfilterService) { }

  //beim Init
  ngOnInit() {

    //Bei Aenderung des Suchfeldes den Suchterm in Filterservice eintragen
    this.searchField.valueChanges.subscribe(searchTerm => {
      this.fs.setSearchTerm(searchTerm);
    });

    //Wenn sich Term von extern aendert (z.B. Suchfeld zuruecksetzen beim Aendern eines Filter), Suchfeldwert anpassen - dabei kein Event feuern
    this.fs.getSearchTerm().subscribe(searchTerm => {
      this.searchField.setValue(searchTerm, { emitEvent: false });
    });
  }
}