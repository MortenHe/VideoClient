import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  //Service injecten
  public constructor(private titleService: Title) { }

  //beim Init
  ngOnInit() {

    //HTML-Page-Title setzen
    this.titleService.setTitle("Video");
  }
}