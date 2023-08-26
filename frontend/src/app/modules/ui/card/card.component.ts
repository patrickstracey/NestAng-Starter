import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() border: boolean = false;
}
