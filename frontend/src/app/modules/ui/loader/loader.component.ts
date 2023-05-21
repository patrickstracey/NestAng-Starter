import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() message: string | null = null;

  constructor() {}

  ngOnInit(): void {}
}
