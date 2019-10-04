import { Directive, ElementRef, Input } from '@angular/core';

//Mark.js importieren
import * as Mark from 'mark.js';

@Directive({
  selector: '[highlight]'
})

//Text farblich markieren
export class HighlightDirective {

  //Suchstring, der farblich hinterlegt wird
  @Input() highlight;

  constructor(private el: ElementRef) { }

  //Wenn der View gebaut wurde, Titel farblich markieren
  ngAfterViewInit() {
    this.markTitle();
  }

  //Wenn sich der Suchterm aendert, Titel farblich markieren
  ngOnChanges() {
    this.markTitle();
  }

  //Titel farblich markieren anhand des Suchstrings
  markTitle() {
    let instance = new Mark(this.el.nativeElement);

    //Auf jeden Fall Markierung zuruecksetzen (Wenn Suchfeld leer, aber auch wenn inkrementell gesucht wird)
    instance.unmark();

    //Nur ab einer gewissen Laenge markieren
    if (this.highlight.length > 2) {
      instance.mark(this.highlight);
    }
  }
}