import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'picontrol',
  templateUrl: './picontrol.component.html',
  styleUrls: ['./picontrol.component.scss']
})

export class PicontrolComponent {

  //Nutzer muss 2 mal auf Shutdown klicken, klicks zaehlen
  clicks = 0;

  //Service injecten
  constructor(private bs: BackendService) { }

  //Pi per Service herunterfahren
  shutdownPi() {

    //Clicks erhoehen
    this.clicks++;

    //Wenn der Nutzer innerhalb einer gewissen Zeit 2 mal geklickt hat
    if (this.clicks === 2) {

      //Pi herunterfahren
      this.bs.sendMessage({ type: "shutdown", value: "" });
    }

    //Timeout erstellen, damit clicks wieder zurueckgesetzt wird
    else {
      setTimeout(() => {
        this.clicks = 0;
      }, 2000);
    }
  }
}