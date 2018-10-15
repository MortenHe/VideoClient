import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'volume-slider',
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.scss']
})

export class VolumeSliderComponent {

  //Services injecten
  constructor(private http: Http) { }

  //Bei Ziehen des Sliders
  sliderInput($event) {

    //Volumewert auslesen
    let volume = $event.value;

    //Service fuer Volumeanpassung aufrufen
    //TODO auf WebSocket umstellen
  }
}