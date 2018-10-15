import { Component, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { ResultfilterService } from '../../services/resultfilter.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'modefilter',
  templateUrl: './modefilter.component.html',
  styleUrls: ['./modefilter.component.scss']
})

export class ModefilterComponent implements OnInit {

  //Form fuer Filter-Buttons
  modeFilterForm;

  //Filter-Werte als Observable
  modeFilter$;

  //Services injecten
  constructor(private fb: FormBuilder, private fs: ResultfilterService, private bs: BackendService) { }

  //Beim Init
  ngOnInit() {

    //Liste der Mode-Filter per Service abbonieren
    this.modeFilter$ = this.bs.getModeFilterList();

    //Reactive Form fuer Filter-Buttons erstellen
    this.modeFilterForm = this.fb.group({

      //Filter-Buttons
      "mode": ""
    });

    //Bei Aenderungen der Filter-Buttons
    this.modeFilterForm.get('mode').valueChanges.subscribe(mode => {

      //Modus-Filter setzen
      this.fs.setModeFilter(mode);
    });

    //Bei Navigation-Aenderung aendert sich der Video-Modus
    this.bs.getMode().subscribe(

      //den Mode-Filter auf all setzen, damit alle Videos des neuen Modus angezeigt werden
      newMode => this.modeFilterForm.controls['mode'].setValue("all"));
  }
}