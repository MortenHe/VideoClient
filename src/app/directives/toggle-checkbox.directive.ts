import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appToggleCheckbox]'
})
export class ToggleCheckboxDirective {

  //Labeltext ('Trackanzeige')
  @Input('label') labelText: string;
  @Input('appToggleCheckbox') type: string;
  @Input('fa') fa: string;
  @Input('id') id: string;

  //Renderer2 fuer DOM-Manipulation
  constructor(private _el: ElementRef, private _renderer: Renderer2) { }

  //Beim Init (wenn Input() Werte zur Verfuegung stehen)
  ngOnInit() {

    //aktuelles HTML-Element
    const el = this._el.nativeElement;

    // Get parent of the original input element
    const parent = this._el.nativeElement.parentNode;

    // Remove the directive attribute (not really necessary, but just to be clean)
    this._renderer.removeAttribute(el, "appToggleCheckbox");

    //Entscheiden wie Checkbox gestylt wird
    switch (this.type) {

      //als toggle-switch
      case "switch":

        // Remove the input
        this._renderer.removeChild(parent, el);

        // Create a top label with CSS
        const topSwitchLabel = this._renderer.createElement("label");
        this._renderer.addClass(topSwitchLabel, "input-wrapper");

        // Add label after input
        this._renderer.appendChild(parent, topSwitchLabel);

        //Span mit Label (Trackanzeige) erstellen und in parent label einfuegen
        const span = this._renderer.createElement('span')
        this._renderer.addClass(span, "label");
        const spanText = this._renderer.createText(this.labelText);
        this._renderer.appendChild(span, spanText);
        this._renderer.appendChild(topSwitchLabel, span);

        //Struktur fuer Toggle-Switch erstellen -> Kombi_DIV
        const switchDiv = this._renderer.createElement('div');
        this._renderer.addClass(switchDiv, 'switch');

        //CSS bei Input setzen und in Kombi-DIV einfuegen
        this._renderer.addClass(el, "switch-input");
        this._renderer.appendChild(switchDiv, el);

        //Switch-Label erstellen und in Kombi-DIV einfuegen
        const switchLabel = this._renderer.createElement('span');
        this._renderer.addClass(switchLabel, "switch-label");
        this._renderer.setAttribute(switchLabel, 'data-on', 'an');
        this._renderer.setAttribute(switchLabel, 'data-off', 'aus');
        this._renderer.appendChild(switchDiv, switchLabel);

        //Switch-Handle erstellen und in Kombi-DIV einfuegen
        const switchHandle = this._renderer.createElement('span');
        this._renderer.addClass(switchHandle, "switch-handle");
        this._renderer.appendChild(switchDiv, switchHandle);

        //Kombi-DIV in parent-Label einfuegen
        this._renderer.appendChild(topSwitchLabel, switchDiv);
        break;

      //Als ClickButton
      case 'clickButton':

        //Checkbox unsichtbar
        this._renderer.addClass(el, "d-none");

        //create label next to input
        const nextLabel = this._renderer.createElement("label");
        this._renderer.addClass(nextLabel, "next-label");
        this._renderer.addClass(nextLabel, "fa");
        this._renderer.addClass(nextLabel, this.fa);
        this._renderer.addClass(nextLabel, "shadow");
        this._renderer.setAttribute(nextLabel, "for", this.id);

        // Add label after input
        this._renderer.appendChild(parent, nextLabel);
        break;
    }
  }
}