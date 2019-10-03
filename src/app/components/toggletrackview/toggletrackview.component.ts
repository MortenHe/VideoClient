import { Component, OnInit } from '@angular/core';
import { ResultfilterService } from '../../services/resultfilter.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'toggletrackview',
  templateUrl: './toggletrackview.component.html',
  styleUrls: ['./toggletrackview.component.scss']
})

export class ToggletrackviewComponent implements OnInit {

  //Checkbox fuer Track-Anzeige
  showTracksCheckbox = new FormControl();

  //Service injecten
  constructor(private fs: ResultfilterService) { }

  //Beim Init
  ngOnInit() {

    //Aenderung bei Checkbox verfolgen und in Service schreiben
    this.showTracksCheckbox.valueChanges.subscribe(bool => this.fs.setShowTracks(bool));

    //Wenn sich Variable (von aussen) aendert
    this.fs.getShowTracks().subscribe(bool => {

      //Wert in Checkbox anpassen, aber kein Event feuern
      this.showTracksCheckbox.setValue(bool, { emitEvent: false });
    });
  }
}