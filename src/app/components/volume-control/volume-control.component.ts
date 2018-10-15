import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.scss']
})

export class VolumeControlComponent {

  //Aktueller Lautstaerkewert
  volume: number

  //Service injecten
  constructor(private bs: BackendService) { }

  //Beim Init
  ngOnInit() {

    //Aktuelle Lautstaerke abbonieren
    this.bs.getVolume().subscribe(volume => {
      this.volume = volume;
    });
  }

  //Volume leiser oder lauter an WSS schicken
  changeVolume(increase) {
    this.bs.sendMessage({ type: "change-volume", value: increase });
  }
}