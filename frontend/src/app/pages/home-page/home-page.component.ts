import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  loading: boolean = true;

  ngOnInit() {
    this.setupHomePage();
  }

  setupHomePage() {
    //api calls for the data you want to fetch
    this.loading = false;
  }
}
