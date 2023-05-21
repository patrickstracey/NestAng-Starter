import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent implements OnInit {
  @Input() message: string = 'No relevant results found.';

  constructor() {}

  ngOnInit(): void {}
}
