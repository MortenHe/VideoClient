import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'selectmode',
  templateUrl: './selectmode.component.html',
  styleUrls: ['./selectmode.component.scss']
})
export class SelectmodeComponent implements OnInit {

  //Liste der Modes
  modes: any[];

  //Form fuer Auswahl des Modus
  selectModeForm;

  //Services injecten
  constructor(private fb: FormBuilder, private bs: BackendService, private router: Router) { }

  //beim Init
  ngOnInit() {

    //Modes aus Config laden
    this.modes = environment.domainModes;

    //Reactive Form fuer Mode-Select erstellen
    this.selectModeForm = this.fb.group({
      "select-mode": ""
    });

    //Wenn sich Wert des Mode-Select aendert
    this.selectModeForm.get("select-mode").valueChanges.subscribe(mode => {

      //zu passender URL navigieren
      this.router.navigate(['/search', mode]);
    });

    //Wen sich der Modus aendert (z.B. URL annavigiert oder Aenderung per Select)
    this.bs.getMode().subscribe(mode => {

      //ausgewaehlten Modus in Select setzen, dabei kein changeevent triggern
      this.selectModeForm.controls["select-mode"].setValue(mode, { emitEvent: false });
    });
  }
}