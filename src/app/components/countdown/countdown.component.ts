import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  //Anzahl der Sekunden bis Shutdown
  countdownTime: number;

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //Anzahl der Sekunden bis Shutdown abbonieren
    this.bs.getCountdownTime().subscribe(countdownTime => {
      this.countdownTime = countdownTime;
    });
  }
}