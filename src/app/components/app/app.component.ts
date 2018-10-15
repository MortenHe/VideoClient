import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  //App-Name aus Config holen
  envName = environment.envName;

  //Service injecten
  public constructor(private titleService: Title) { }

  //beim Init
  ngOnInit() {

    //HTML-Page-Title setzen
    this.titleService.setTitle(this.envName);
  }
}