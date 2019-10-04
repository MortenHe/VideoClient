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

  //Filter-Werte
  modeFilter;

  //Services injecten
  constructor(private fb: FormBuilder, private fs: ResultfilterService, private bs: BackendService) { }

  //Beim Init
  ngOnInit() {

    //Liste der Mode-Filter per Service abbonieren
    this.bs.getModeFilterList().subscribe(modeFilter => {
      this.modeFilter = modeFilter;
    });

    //Reactive Form fuer Filter-Buttons erstellen
    this.modeFilterForm = this.fb.group({
      "mode": ""
    });

    //Bei Aenderungen der Filter-Buttons, Modus-Filter setzen
    this.modeFilterForm.get('mode').valueChanges.subscribe(mode => {
      this.fs.setModeFilter(mode);
    });

    //Bei Navigation-Aenderung aendert sich der Video-Modus, den Mode-Filter auf all setzen, damit alle Videos des neuen Modus angezeigt werden
    this.bs.getMode().subscribe(
      () => this.modeFilterForm.controls['mode'].setValue("all"));
  }
}