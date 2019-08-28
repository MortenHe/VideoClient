import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.scss']
})

export class VolumeControlComponent {

  //Aktuelle Position in Playlist
  position: number;

  //Aktuelle Lautstaerke
  volume: number;

  //Service injecten
  constructor(private bs: BackendService) { }

  //Beim Init
  ngOnInit() {

    //Aktuelle Position abbonieren
    this.bs.getPosition().subscribe(position => {
      this.position = position
    });

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