import { Component, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { ResultfilterService } from '../../services/resultfilter.service';

@Component({
  selector: 'searchfilter',
  templateUrl: './searchfilter.component.html',
  styleUrls: ['./searchfilter.component.scss']
})

export class SearchfilterComponent implements OnInit {

  //Form fuer Suchfeld
  searchFilterForm;

  //Services injecten
  constructor(private fb: FormBuilder, private fs: ResultfilterService) { }

  //beim Init
  ngOnInit() {

    //Reactive Form fuer Suchfeld erstellen
    this.searchFilterForm = this.fb.group({

      //Suchfeld fuer Filterung
      "search": ""
    });

    //Bei Aenderung des Suchfeldes
    this.searchFilterForm.get('search').valueChanges.subscribe(searchTerm => {

      //Suchterm in Filterservice eintragen
      this.fs.setSearchTerm(searchTerm);
    });

    //Wenn sich Term von extern aendert (z.B. Suchfeld zuruecksetzen beim Aendern eines Filter), Suchfeldwert anpassen - dabei kein Event feuern
    this.fs.getSearchTerm().subscribe(searchTerm => {
      this.searchFilterForm.get('search').setValue(searchTerm, { emitEvent: false });
    })
  }
}