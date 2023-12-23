import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'next',
  templateUrl: './next-page.component.html',
  styleUrls: ['./next-page.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NextPageComponent {
  constructor() {}
}
