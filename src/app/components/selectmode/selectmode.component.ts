import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { domainModes } from '../../share/domainModes';

@Component({
  selector: 'selectmode',
  templateUrl: './selectmode.component.html',
  styleUrls: ['./selectmode.component.scss']
})
export class SelectmodeComponent implements OnInit {

  //aktiver Modus
  activeMode: string;

  //Liste der Modes (Serien, Kindervideos)
  modes: any[] = domainModes;

  //Services injecten
  constructor(private bs: BackendService, private router: Router) { }

  //beim Init
  ngOnInit() {

    //1. Modus als aktiv setzen
    this.activeMode = this.modes[0];

    //Wen sich der Modus aendert (z.B. URL annavigiert oder Aenderung per Select), Modus merken
    this.bs.getMode().subscribe(mode => {
      this.activeMode = mode;
    });
  }

  //Wenn Modus gesetzt wird, zu passender URL navigieren
  setMode(mode) {
    this.router.navigate(['/search', mode]);
  }
}